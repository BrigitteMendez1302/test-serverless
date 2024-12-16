import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { CustomDataRepository } from "../../domain/repositories/CustomDataRepository";
import { CustomData } from "../../domain/entities/CustomData";


export class DynamoCustomDataRepository implements CustomDataRepository{
  private dynamoDbClient: DynamoDBClient;
  private tableName: string;

  constructor() {
    this.dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.tableName = process.env.CUSTOM_DATA_TABLE_NAME || "CustomDataTable";
  }

  async storeCustomData(data: CustomData): Promise<void> {
    const record = {
      id: data.id || `custom-${Date.now()}`, // Usa el id proporcionado o genera uno nuevo
      type: data.type,
      content: data.content,
      createdAt: data.createdAt || new Date().toISOString(), // Mantén la fecha si ya existe
    };
  
    await this.dynamoDbClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: record,
      })
    );
  }
}
