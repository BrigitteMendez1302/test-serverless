import { DynamoDBClient, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Character } from "../../domain/Character";
import { FusionRepository } from "../../domain/interfaces/FusionRepository";


export class DynamoFusionRepository implements FusionRepository{
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

  async getFusionHistory(limit: number, nextToken?: string): Promise<{ items: any[]; nextToken?: string }> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
      Limit: limit,
      ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, "base64").toString("utf-8")) : undefined,
    };

    const response = await this.dynamoDbClient.send(new ScanCommand(params));

    return {
      items: response.Items || [],
      nextToken: response.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(response.LastEvaluatedKey)).toString("base64")
        : undefined,
    };
  }
}
