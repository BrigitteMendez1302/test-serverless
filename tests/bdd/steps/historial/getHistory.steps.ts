import { Given, When, Then } from "@cucumber/cucumber";
import { HistorialService } from "../../../../src/fusionados/application/HistorialService";
import { DynamoFusionRepository } from "../../../../src/fusionados/infrastructure/repositories/DynamoFusionRepository";


jest.mock("../../../../src/fusionados/infrastructure/repositories/DynamoFusionRepository");

let historialService: HistorialService;
let fusionRepository: jest.Mocked<DynamoFusionRepository>;
let result: any;
let error: Error | null;

Given("un tamaño de página {int} y un número de página {int}", (pageSize: number, npage: number) => {
  fusionRepository = new DynamoFusionRepository() as jest.Mocked<DynamoFusionRepository>;
  historialService = new HistorialService(fusionRepository);
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
  result = null;
  error = null;

  // Configuramos los datos de prueba
  globalThis.pageSize = pageSize;
  globalThis.npage = npage;
});

When("llamo al método {string}", async (methodName: string) => {
  try {
    result = await historialService[methodName](globalThis.pageSize, globalThis.npage);
  } catch (e: any) {
    error = e;
  }
});

Then("debe retornar los registros obtenidos del repositorio", () => {
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
  expect(result).toEqual(mockResponse);
});

Then("el repositorio debe ser llamado con tamaño de página {int} y número de página {int}", (pageSize: number, npage: number) => {
  expect(fusionRepository.getChronologicalRecords).toHaveBeenCalledWith(pageSize, npage);
});

Then("debe lanzar un error con el mensaje {string}", (errorMessage: string) => {
  expect(error).not.toBeNull();
  expect(error!.message).toBe(errorMessage);
});
