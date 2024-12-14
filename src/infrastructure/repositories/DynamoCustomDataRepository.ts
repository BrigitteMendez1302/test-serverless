import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { CustomDataRepository } from "../../domain/interfaces/CustomDataRepository";


export class DynamoCustomDataRepository implements CustomDataRepository{
  private dynamoDbClient: DynamoDBClient;
  private tableName: string;

  constructor() {
    this.dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.tableName = process.env.CUSTOM_DATA_TABLE!;
  }

  async storeCustomData(data: { type: string; content: Record<string, unknown>; }): Promise<void> {
    const record = {
      id: `custom-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };

    await this.dynamoDbClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: record,
      })
    );
  }
}
