import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { AuthRepository } from '../../domain/repositories/AuthRepository';

const dynamoDbClient = new DynamoDBClient({});

export class DynamoAuthRepository implements AuthRepository {
  async findUserByUsername(username: string): Promise<{ username?: string; password?: string } | null> {
    const command = new GetItemCommand({
      TableName: 'UsersTable',
      Key: { username: { S: username } },
    });
    const result = await dynamoDbClient.send(command);
    if (!result.Item) return null;

    return { username: result.Item.username.S, password: result.Item.password.S };
  }

  async createUser(username: string, password: string): Promise<void> {
    const command = new PutItemCommand({
      TableName: 'UsersTable',
      Item: {
        username: { S: username },
        password: { S: password },
      },
    });
    await dynamoDbClient.send(command);
  }
}
