import { DynamoDBClient, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Character } from "../../domain/entities/Character";
import { FusionRepository } from "../../domain/repositories/FusionRepository";
import { v4 as uuidv4 } from 'uuid';
import { unmarshall } from "@aws-sdk/util-dynamodb";


export class DynamoFusionRepository implements FusionRepository{
  private dynamoDbClient: DynamoDBClient;
  private tableName: string;

  constructor() {
    this.dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.tableName = process.env.FUSIONADOS_TABLE!;
  }

  async saveFusionedData(data: Character[]): Promise<void> {

    const promises = data.map((character) => {
      const createdAt = new Date().toISOString();
      const uniqueSuffix = `#${Math.floor(Math.random() * 1000)}`;
      const sortKey = `${createdAt}${uniqueSuffix}`;
      const [year, month] = createdAt.split('-');
      const partitionKey = `${year}-${month}`;
  
      const record = {
        partitionKey,
        createdAt,
        sortKey,
        id: uuidv4(),
        name: character.name,
        homeworld: character.homeworld,
        climate: character.climate,
        pokemon_friend: character.pokemon_friend,
      };
  
      const params = {
        TableName: this.tableName,
        Item: record,
      };
  
      return this.dynamoDbClient.send(new PutCommand(params));
    });
  
    await Promise.all(promises);
  }
  

  async getTotalCount(): Promise<number> {
    let totalCount = 0;
    let exclusiveStartKey: Record<string, any> | undefined;

    do {
      const params: ScanCommandInput = {
        TableName: this.tableName,
        Select: "COUNT",
        ExclusiveStartKey: exclusiveStartKey,
      };

      const response = await this.dynamoDbClient.send(new ScanCommand(params));

      totalCount += response.Count || 0;
      exclusiveStartKey = response.LastEvaluatedKey;
    } while (exclusiveStartKey);

    return totalCount;
  }

  private getPartitionKeys(): string[] {
    const startYear = 2024;
    const startMonth = 12;
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
    const startIndex = (npage - 1) * pageSize + 1;
    const endIndex = npage * pageSize;
    let accumulatedRecords: any[] = [];
    let exclusiveStartKey: any = undefined;

    const totalItems = await this.getTotalCount();
    const totalPages = Math.ceil(totalItems / pageSize);
      
    if (totalItems === 0 || npage > totalPages) {
      return {
        items: [],
        currentPage: npage > totalPages ? npage : 1,
        totalPages,
        totalItems,
      };
    }
    
  
    const partitions = this.getPartitionKeys();
  
    for (const partition of partitions) {
      while (accumulatedRecords.length < endIndex) {
        const params: QueryCommandInput = {
          TableName: this.tableName,
          KeyConditionExpression: "#partitionKey = :partitionValue",
          ExpressionAttributeNames: {
            "#partitionKey": "partitionKey",
          },
          ExpressionAttributeValues: {
            ":partitionValue": { S: partition },
          },
          ScanIndexForward: true,
          ExclusiveStartKey: exclusiveStartKey,
        };
  
        const response = await this.dynamoDbClient.send(new QueryCommand(params));
        exclusiveStartKey = response.LastEvaluatedKey;
  
        accumulatedRecords.push(...(response.Items || []));
  
        if (!exclusiveStartKey) {
          break;
        }
      }
  
      if (accumulatedRecords.length >= endIndex) {
        break;
      }
    }
  
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
