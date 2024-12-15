import { FusionService } from "../../src/fusionados/application/FusionService";
import { SwapiCharacter } from "../../src/fusionados/domain/entities/SwapiCharacter";
import { StarWarsService } from "../../src/fusionados/infrastructure/integrations/StarWarsService";
import { PokemonService } from "../../src/fusionados/infrastructure/integrations/PokemonService";
import { DynamoFusionRepository } from "../../src/fusionados/infrastructure/repositories/DynamoFusionRepository";

// Mockear dependencias
jest.mock("../../src/fusionados/infrastructure/integrations/StarWarsService");
jest.mock("../../src/fusionados/infrastructure/integrations/PokemonService");
jest.mock("../../src/fusionados/infrastructure/repositories/DynamoFusionRepository");

describe("FusionService", () => {
  let fusionService: FusionService;
  let starWarsService: jest.Mocked<StarWarsService>;
  let pokemonService: jest.Mocked<PokemonService>;
  let fusionRepository: jest.Mocked<DynamoFusionRepository>;

  beforeEach(() => {
    starWarsService = new StarWarsService() as jest.Mocked<StarWarsService>;
    pokemonService = new PokemonService() as jest.Mocked<PokemonService>;
    fusionRepository = new DynamoFusionRepository() as jest.Mocked<DynamoFusionRepository>;

    fusionService = new FusionService(starWarsService, pokemonService, fusionRepository);
  });

  it("debe fusionar correctamente los datos de personajes, planetas y Pokémon", async () => {
    // Mock de datos
    const characters: SwapiCharacter[] = [
      { name: "Luke Skywalker", homeworld: "https://swapi.info/api/planets/1/" },
      { name: "R2-D2", homeworld: "https://swapi.info/api/planets/8/" },
    ];

    const planetMap = {
      "https://swapi.info/api/planets/1/": {
        url: "https://swapi.info/api/planets/1/",
        name: "Tatooine",
        climate: "arid"
      },
      "https://swapi.info/api/planets/8/": {
        url: "https://swapi.info/api/planets/8/",
        name: "Naboo",
        climate: "temperate"
      }
    };

    const climateToPokemonMap = {
      arid: ["Sandshrew", "Cubone"],
      temperate: ["Bulbasaur", "Oddish"],
    };

    // Configurar mocks
    starWarsService.getCharacters.mockResolvedValue(characters);
    starWarsService.getEnrichedPlanets.mockResolvedValue(planetMap);
    pokemonService.getEnrichedHabitats.mockResolvedValue(climateToPokemonMap);
    fusionRepository.saveFusionedData.mockResolvedValue();

    // Llamar al servicio
    const result = await fusionService.getFusionedData();

    // Verificaciones
    expect(starWarsService.getCharacters).toHaveBeenCalled();
    expect(starWarsService.getEnrichedPlanets).toHaveBeenCalledWith(characters);
    expect(pokemonService.getEnrichedHabitats).toHaveBeenCalledWith([
      { url: 'https://swapi.info/api/planets/1/', name: "Tatooine", climate: "arid" },
      { url: 'https://swapi.info/api/planets/8/', name: "Naboo", climate: "temperate" },
    ]);
    expect(fusionRepository.saveFusionedData).toHaveBeenCalledWith([
      {
        name: "Luke Skywalker",
        homeworld: "Tatooine",
        climate: "arid",
        pokemon_friend: ["Sandshrew", "Cubone"],
      },
      {
        name: "R2-D2",
        homeworld: "Naboo",
        climate: "temperate",
        pokemon_friend: ["Bulbasaur", "Oddish"],
      },
    ]);

    // Verificar resultado final
    expect(result).toEqual([
      {
        name: "Luke Skywalker",
        homeworld: "Tatooine",
        climate: "arid",
        pokemon_friend: ["Sandshrew", "Cubone"],
      },
      {
        name: "R2-D2",
        homeworld: "Naboo",
        climate: "temperate",
        pokemon_friend: ["Bulbasaur", "Oddish"],
      },
    ]);
  });

  it("debe manejar correctamente cuando las APIs retornan datos vacíos", async () => {
    starWarsService.getCharacters.mockResolvedValue([]);
    starWarsService.getEnrichedPlanets.mockResolvedValue({});
    pokemonService.getEnrichedHabitats.mockResolvedValue({});
    fusionRepository.saveFusionedData.mockResolvedValue();

    const result = await fusionService.getFusionedData();

    expect(result).toEqual([]);
    expect(fusionRepository.saveFusionedData).toHaveBeenCalledWith([]);
  });

  it("debe lanzar un error si falla alguna API externa", async () => {
    starWarsService.getCharacters.mockRejectedValue(new Error("Star Wars API Error"));

    await expect(fusionService.getFusionedData()).rejects.toThrow("Star Wars API Error");

    expect(starWarsService.getCharacters).toHaveBeenCalled();
    expect(fusionRepository.saveFusionedData).not.toHaveBeenCalled();
  });
});
