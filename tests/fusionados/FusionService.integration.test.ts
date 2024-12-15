// import { FusionService } from "../../src/fusionados/application/FusionService";
// import { StarWarsService } from "../../src/fusionados/infrastructure/integrations/StarWarsService";
// import { PokemonService } from "../../src/fusionados/infrastructure/integrations/PokemonService";
// import { CacheRepository } from "../../src/fusionados/infrastructure/repositories/CacheRepository";
// import { DynamoFusionRepository } from "../../src/fusionados/infrastructure/repositories/DynamoFusionRepository";
// import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
// import { PutCommand } from "@aws-sdk/lib-dynamodb";
// import { mockClient } from "aws-sdk-client-mock";
// import nock from "nock";

// describe("FusionService - Integration", () => {
//   let fusionService: FusionService;
//   let starWarsService: StarWarsService;
//   let pokemonService: PokemonService;
//   let fusionRepository: DynamoFusionRepository;
//   let cacheRepository: CacheRepository;

//   const dynamoMock = mockClient(DynamoDBClient);

//   beforeAll(() => {
//     // Crear las implementaciones reales
//     cacheRepository = new CacheRepository();
//     starWarsService = new StarWarsService(cacheRepository);
//     pokemonService = new PokemonService(cacheRepository);
//     fusionRepository = new DynamoFusionRepository();

//     fusionService = new FusionService(starWarsService, pokemonService, fusionRepository);

//     // Configurar DynamoDB Mock para verificar almacenamiento
//     dynamoMock.on(ListTablesCommand).resolves({ TableNames: ["FusionadosTestTable"] });
//   });

//   beforeEach(() => {
//     nock.cleanAll(); // Limpia las simulaciones previas
//     dynamoMock.reset(); // Limpia el mock de DynamoDB
//   });

//   describe("FusionService - Integration with Cache Mock", () => {
//     let starWarsService: StarWarsService;
//     let pokemonService: PokemonService;
//     let fusionRepository: DynamoFusionRepository;
//     let cacheRepositoryMock: CacheRepository;
  
//     beforeEach(() => {
//       cacheRepositoryMock = new CacheRepository() as jest.Mocked<CacheRepository>;
//       jest.spyOn(cacheRepositoryMock, "get").mockResolvedValue(null); // Caché vacío inicialmente
//       jest.spyOn(cacheRepositoryMock, "set").mockResolvedValue();
  
//       starWarsService = new StarWarsService(cacheRepositoryMock);
//       pokemonService = new PokemonService(cacheRepositoryMock);
//       fusionRepository = new DynamoFusionRepository();
  
//       fusionService = new FusionService(starWarsService, pokemonService, fusionRepository);
//     });
  
//     it("debe manejar correctamente el flujo cuando el caché está vacío", async () => {
//       nock("https://swapi.info/api")
//         .get("/people/")
//         .reply(200, [
//           { name: "Luke Skywalker", homeworld: "https://swapi.info/api/planets/1/" },
//         ]);
  
//       nock("https://swapi.info/api")
//         .get("/planets/1/")
//         .reply(200, { name: "Tatooine", climate: "arid" });
  
//       nock("https://pokeapi.co/api/v2")
//         .get("/pokemon-habitat/rough-terrain")
//         .reply(200, { pokemon_species: [{ name: "Sandshrew" }] });
  
//       const result = await fusionService.getFusionedData();
  
//       expect(result).toEqual([
//         {
//           name: "Luke Skywalker",
//           homeworld: "Tatooine",
//           climate: "arid",
//           pokemon_friend: ["Sandshrew"],
//         },
//       ]);
  
//       expect(cacheRepositoryMock.get).toHaveBeenCalled();
//       expect(cacheRepositoryMock.set).toHaveBeenCalled();
//     });
//   });
  

//   it("debe manejar errores de la API de StarWars correctamente", async () => {
//     // Simular error en la API de StarWars
//     nock("https://swapi.info/api")
//       .get("/people/")
//       .replyWithError("Star Wars API Error");

//     await expect(fusionService.getFusionedData()).rejects.toThrow("Star Wars API Error");

//     // Verificar que no se realizaron operaciones de almacenamiento
//     expect(dynamoMock.commandCalls(PutCommand)).toHaveLength(0);
// });
// });
