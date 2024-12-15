import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class CacheRepository {
  private dynamoDbClient: DynamoDBClient;
  private tableName: string;

  constructor() {
    this.dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.tableName = process.env.CACHE_TABLE!;
  }

  async get<T>(key: string): Promise<T | null> {
    const response = await this.dynamoDbClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { cacheKey: key },
      })
    );
    return response.Item ? JSON.parse(response.Item.data) as T : null;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
    await this.dynamoDbClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          cacheKey: key,
          data: JSON.stringify(value),
          expiresAt,
        },
      })
    );
  }
}
