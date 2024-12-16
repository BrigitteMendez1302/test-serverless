import { CustomDataService } from "../../src/users/application/CustomDataService";
import { DynamoCustomDataRepository } from "../../src/users/infrastructure/repositories/DynamoCustomDataRepository";
import { CustomData } from "../../src/users/domain/entities/CustomData";
import AWS from "aws-sdk";

describe("CustomDataService - Integration", () => {
  let service: CustomDataService;
  let repository: DynamoCustomDataRepository;
  let dynamoClient: AWS.DynamoDB.DocumentClient;

  beforeAll(() => {
    AWS.config.update({ region: "us-east-1" });
    repository = new DynamoCustomDataRepository();
    service = new CustomDataService(repository);
    dynamoClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  });

  afterAll(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it("debe almacenar datos personalizados correctamente", async () => {
  
    const customData: CustomData = {
      id: `custom-${Date.now()}`,
      type: "exampleType",
      content: { key: "value" },
      createdAt: new Date().toISOString()
    };
  
    await service.storeCustomData(customData);
  
    const params = {
      TableName: "CustomDataTable",
      Key: { id: customData.id },
    };
  
    const result = await dynamoClient.get(params).promise();
  
    expect(result.Item).toEqual(
        expect.objectContaining({
          id: customData.id,
          type: customData.type,
          content: customData.content,
          createdAt: expect.any(String),
        })
      );
  });

  it("debe lanzar un error si 'type' no es un string", async () => {
    const invalidData: CustomData = {
      type: 123 as unknown as string, // Simulamos un valor inválido
      content: { key: "value" },
    };

    await expect(service.storeCustomData(invalidData)).rejects.toThrow(
      "El campo 'type' debe ser un string."
    );
  });

  it("debe lanzar un error si 'content' no es un objeto", async () => {
    const invalidData: CustomData = {
      type: "exampleType",
      content: "invalidContent" as unknown as Record<string, unknown>, // Simulamos un valor inválido
    };
  
    await expect(service.storeCustomData(invalidData)).rejects.toThrow(
      "El campo 'content' debe ser un objeto."
    );
  });
  
});
