import { CustomDataService } from "../../src/users/application/CustomDataService";
import { DynamoCustomDataRepository } from "../../src/users/infrastructure/repositories/DynamoCustomDataRepository";
import { CustomData } from "../../src/users/domain/entities/CustomData";

// Mock del repositorio
jest.mock("../../src/users/infrastructure/repositories/DynamoCustomDataRepository");

describe("CustomDataService", () => {
  let customDataService: CustomDataService;
  let customDataRepository: jest.Mocked<DynamoCustomDataRepository>;

  beforeEach(() => {
    customDataRepository = new DynamoCustomDataRepository() as jest.Mocked<DynamoCustomDataRepository>;
    customDataService = new CustomDataService(customDataRepository);
  });

  it("debe almacenar datos personalizados válidos", async () => {
    const mockData: CustomData = {
      type: "example",
      content: { key: "value" },
      createdAt: undefined,
    };

    await customDataService.storeCustomData(mockData);

    expect(customDataRepository.storeCustomData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "example",
        content: { key: "value" },
        createdAt: expect.any(String), // Debe asignar automáticamente createdAt
      })
    );
  });

  it("debe lanzar un error si 'type' no es un string", async () => {
    const invalidData: CustomData = {
      type: 123 as unknown as string,
      content: { key: "value" },
      createdAt: undefined,
    };

    await expect(customDataService.storeCustomData(invalidData)).rejects.toThrow(
      "El campo 'type' debe ser un string."
    );

    expect(customDataRepository.storeCustomData).not.toHaveBeenCalled();
  });

  it("debe lanzar un error si 'content' no es un objeto", async () => {
    const invalidData: CustomData = {
      type: "example",
      content: null as unknown as Record<string, unknown>, // null no es un objeto
      createdAt: undefined,
    };

    await expect(customDataService.storeCustomData(invalidData)).rejects.toThrow(
      "El campo 'content' debe ser un objeto."
    );

    expect(customDataRepository.storeCustomData).not.toHaveBeenCalled();
  });

  it("debe asignar 'createdAt' si no está presente", async () => {
    const mockData: CustomData = {
      type: "example",
      content: { key: "value" },
    };

    await customDataService.storeCustomData(mockData);

    expect(customDataRepository.storeCustomData).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: expect.any(String), // createdAt debe ser asignado automáticamente
      })
    );
  });
});
