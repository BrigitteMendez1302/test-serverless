import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Character } from "../../domain/Character";

export class FusionRepository {
  private dynamoDbClient: DynamoDBClient;
  private tableName: string;

  // Inicializa el cliente DynamoDB y el nombre de la tabla
  constructor() {
    this.dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.tableName = process.env.FUSIONADOS_TABLE!; // Nombre de la tabla desde el entorno
  }

  async saveFusionedData(data: Character[]): Promise<void> {
    const record = {
      id: `fusionados-${Date.now()}`, // ID único
      data,                          // Datos fusionados
      createdAt: new Date().toISOString(), // Marca de tiempo
    };

    const params = {
      TableName: this.tableName,
      Item: record,
    };

    // Ejecuta el comando de alto nivel para insertar los datos
    await this.dynamoDbClient.send(new PutCommand(params));
  }
}
