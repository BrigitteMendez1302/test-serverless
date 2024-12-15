import { HistorialService } from "../../src/fusionados/application/HistorialService";
import { DynamoFusionRepository } from "../../src/fusionados/infrastructure/repositories/DynamoFusionRepository";

// Mock del DynamoFusionRepository
jest.mock("../../src/fusionados/infrastructure/repositories/DynamoFusionRepository");

describe("HistorialService", () => {
  let historialService: HistorialService;
  let fusionRepository: jest.Mocked<DynamoFusionRepository>;

  beforeEach(() => {
    fusionRepository = new DynamoFusionRepository() as jest.Mocked<DynamoFusionRepository>;
    historialService = new HistorialService(fusionRepository);
  });

  it("debe lanzar un error si pageSize es menor o igual a 0", async () => {
    await expect(historialService.getHistory(0, 1)).rejects.toThrow(
      "El parámetro 'pageSize' debe estar entre 1 y 10."
    );
  });

  it("debe lanzar un error si pageSize es mayor a 10", async () => {
    await expect(historialService.getHistory(11, 1)).rejects.toThrow(
      "El parámetro 'pageSize' debe estar entre 1 y 10."
    );
  });

  it("debe llamar a fusionRepository.getChronologicalRecords con parámetros correctos", async () => {
    // Mock del resultado esperado
    const mockResponse = {
      items: [
        {
            "partitionKey": "2024-12",
            "climate": "temperate",
            "sortKey": "2024-12-15T16:25:31.061Z#179",
            "homeworld": "Stewjon",
            "createdAt": "2024-12-15T16:25:31.061Z",
            "id": "9f2dde8b-cf80-4b70-b85b-5684b8ac8361",
            "pokemon_friend": [
                "bulbasaur",
                "rattata",
                "ekans",
                "nidoran-f",
                "nidoran-m"
            ],
            "name": "Obi-Wan Kenobi"
        },
        {
            "partitionKey": "2024-12",
            "climate": "arid",
            "sortKey": "2024-12-15T16:25:31.061Z#534",
            "homeworld": "Tatooine",
            "createdAt": "2024-12-15T16:25:31.061Z",
            "id": "a61cd666-8164-4f65-a06e-027d6ce261d4",
            "pokemon_friend": [
                "spearow",
                "sandshrew",
                "magnemite",
                "rhyhorn",
                "skarmory"
            ],
            "name": "Beru Whitesun lars"
        },
      ],
      currentPage: 1,
      totalPages: 4,
      totalItems: 8,
    };
    fusionRepository.getChronologicalRecords.mockResolvedValue(mockResponse);

    // Ejecutar el método con parámetros válidos
    const result = await historialService.getHistory(2, 1);

    // Verificar que fusionRepository fue llamado correctamente
    expect(fusionRepository.getChronologicalRecords).toHaveBeenCalledWith(2, 1);

    // Verificar que el resultado sea el esperado
    expect(result).toEqual(mockResponse);
  });

  it("debe manejar correctamente un repositorio que devuelve un resultado vacío", async () => {
    const mockResponse = {
      items: [],
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
    };
  
    fusionRepository.getChronologicalRecords.mockResolvedValue(mockResponse);
  
    const result = await historialService.getHistory(3, 1);
  
    expect(fusionRepository.getChronologicalRecords).toHaveBeenCalledWith(3, 1);
  
    expect(result).toEqual({
      items: [],
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
    });
  });

  it("debe retornar un objeto vacío si la página solicitada está fuera del rango", async () => {
    const mockResponse = {
      items: [],
      currentPage: 5,
      totalPages: 3,
      totalItems: 12,
    };
  
    fusionRepository.getChronologicalRecords.mockResolvedValue(mockResponse);
  
    const result = await historialService.getHistory(3, 5);
  
    expect(fusionRepository.getChronologicalRecords).toHaveBeenCalledWith(3, 5);
  
    expect(result).toEqual({
      items: [],
      currentPage: 5,
      totalPages: 3,
      totalItems: 12,
    });
  });
  
  
});
