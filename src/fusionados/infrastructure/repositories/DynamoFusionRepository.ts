import { DynamoDBClient, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Character } from "../../domain/entities/Character";
import { FusionRepository } from "../../domain/repositories/FusionRepository";
import { v4 as uuidv4 } from 'uuid';
import { unmarshall } from "@aws-sdk/util-dynamodb"; // Importar la función unmarshall


export class DynamoFusionRepository implements FusionRepository{
  private dynamoDbClient: DynamoDBClient;
  private tableName: string;

  // Inicializa el cliente DynamoDB y el nombre de la tabla
  constructor() {
    this.dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.tableName = process.env.FUSIONADOS_TABLE!; // Nombre de la tabla desde el entorno
  }

  async saveFusionedData(data: Character[]): Promise<void> {

    console.log("data.length; ", data.length);

    const promises = data.map((character) => {
      // Generar el partitionKey basado en el Año-Mes del registro
      const createdAt = new Date().toISOString();
      const uniqueSuffix = `#${Math.floor(Math.random() * 1000)}`; // Milisegundos aleatorios para unicidad
      const sortKey = `${createdAt}${uniqueSuffix}`; // Concatenar timestamp con sufijo único
      const [year, month] = createdAt.split('-'); // Extrae año y mes del timestamp
      const partitionKey = `${year}-${month}`; // Genera el valor de la partición
  
      const record = {
        partitionKey, // Llave de partición (Año-Mes)
        createdAt,    // Llave de ordenamiento (ISO 8601)
        sortKey,      // Llave de ordenamiento única
        id: uuidv4(), // ID único para el registro
        name: character.name,
        homeworld: character.homeworld,
        climate: character.climate,
        pokemon_friend: character.pokemon_friend,
      };
  
      const params = {
        TableName: this.tableName,
        Item: record,
      };
  
      // Retorna una promesa para guardar cada registro
      return this.dynamoDbClient.send(new PutCommand(params));
    });
  
    // Espera a que todas las operaciones se completen
    await Promise.all(promises);
  }
  

  async getTotalCount(): Promise<number> {
    let totalCount = 0;
    let exclusiveStartKey: Record<string, any> | undefined;

    do {
      const params: ScanCommandInput = {
        TableName: this.tableName,
        Select: "COUNT", // Solo cuenta registros, no devuelve datos
        ExclusiveStartKey: exclusiveStartKey,
      };

      const response = await this.dynamoDbClient.send(new ScanCommand(params));

      totalCount += response.Count || 0; // Acumula el conteo parcial
      exclusiveStartKey = response.LastEvaluatedKey; // Llave para continuar el escaneo
    } while (exclusiveStartKey); // Continua mientras haya más datos

    return totalCount;
  }

  private getPartitionKeys(): string[] {
    const startYear = 2024;
    const startMonth = 12; // El primer registro comienza en diciembre de 2024
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
  
    const partitions: string[] = [];
  
    for (let year = startYear; year <= currentYear; year++) {
      for (let month = year === startYear ? startMonth : 1; month <= (year === currentYear ? currentMonth : 12); month++) {
        const formattedMonth = month.toString().padStart(2, "0");
        partitions.push(`${year}-${formattedMonth}`);
      }
    }
  
    return partitions;
  }

  async getChronologicalRecords(
    pageSize: number,
    npage: number,
  ): Promise<{
    items: any[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    const startIndex = (npage - 1) * pageSize + 1; // Índice inicial del rango
    const endIndex = npage * pageSize; // Índice final del rango
    let accumulatedRecords: any[] = []; // Acumulación de registros
    let exclusiveStartKey: any = undefined; // Llave para continuar consultas
  
    // Obtén todas las particiones cronológicamente ascendentes
    const partitions = this.getPartitionKeys();
  
    // Iterar sobre las particiones
    for (const partition of partitions) {
      while (accumulatedRecords.length < endIndex) {
        const params: QueryCommandInput = {
          TableName: this.tableName,
          KeyConditionExpression: "#partitionKey = :partitionValue",
          ExpressionAttributeNames: {
            "#partitionKey": "partitionKey",
          },
          ExpressionAttributeValues: {
            ":partitionValue": { S: partition }, // Especifica que el valor es un string
          },
          ScanIndexForward: true, // Orden ascendente por createdAt
          ExclusiveStartKey: exclusiveStartKey,
        };
  
        const response = await this.dynamoDbClient.send(new QueryCommand(params));
        exclusiveStartKey = response.LastEvaluatedKey;
  
        // Acumula los registros
        accumulatedRecords.push(...(response.Items || []));
  
        if (!exclusiveStartKey) {
          break; // No hay más registros en esta partición
        }
      }
  
      // Si ya se acumularon suficientes registros, detener iteración
      if (accumulatedRecords.length >= endIndex) {
        break;
      }
    }
  
    // Calcula el total de registros (opcional, puedes optimizar según necesidades)
    const totalItems = await this.getTotalCount();
    const totalPages = Math.ceil(totalItems / pageSize);
  
    if (npage > totalPages) {
      throw new Error(`La página solicitada (${npage}) no existe. Total de páginas: ${totalPages}.`);
    }
  
    // Filtra los registros acumulados para obtener el rango solicitado
    const paginatedItemsRaw = accumulatedRecords.slice(startIndex - 1, endIndex);
    const paginatedItems = paginatedItemsRaw.map((item) => unmarshall(item));
  
    return {
      items: paginatedItems,
      currentPage: npage,
      totalPages,
      totalItems,
    };
  }  
}
