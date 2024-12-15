import { StarWarsAPI } from "../../domain/repositories/StarWarsRepository";
import { SwapiCharacter } from "../../domain/entities/SwapiCharacter";
import { Planet } from "../../domain/entities/Planet";
import axios from 'axios';
import { CacheRepository } from "../repositories/CacheRepository";

export class StarWarsService implements StarWarsAPI {
  private readonly baseURL = 'https://swapi.info/api/';
  private readonly cacheRepository: CacheRepository;

  constructor() {
    this.cacheRepository = new CacheRepository();
  }


  async getCharacters(): Promise<SwapiCharacter[]> {
    const cacheKey = "starwars_characters";

    const cachedData = await this.cacheRepository.get<SwapiCharacter[]>(cacheKey);
    if (cachedData) {
      console.log("Datos obtenidos desde el caché characters.");
      return cachedData;
    }

    const response = await axios.get(`${this.baseURL}people/`);

    const characters: SwapiCharacter[] = response.data.slice(0, 10).map((character: SwapiCharacter) => ({
      name: character.name,
      homeworld: character.homeworld,
    }));

    await this.cacheRepository.set(cacheKey, characters, 1800);
    return characters;
  }

  async getEnrichedPlanets(characters: SwapiCharacter[]): Promise<Record<string, Planet>> {
    const planetUrls = characters.map((character) => character.homeworld);
    const uniquePlanetUrls = Array.from(new Set(planetUrls));

    const planetDetails = await Promise.all(
      uniquePlanetUrls.map(async (url) => {
        const cacheKey = `planet-${url}`;
        const cachedPlanet = await this.cacheRepository.get<Planet>(cacheKey);
        if (cachedPlanet) {
          console.log(`Planeta obtenido desde caché: ${url}`);
          return cachedPlanet;
        }
        const response = await axios.get(url);
        const planet: Planet = {
          url,
          name: response.data.name,
          climate: response.data.climate,
        };
        await this.cacheRepository.set(cacheKey, planet, 1800);
        return planet;
      })
    );

    return Object.fromEntries(
      planetDetails.map((planet) => [planet.url, planet])
    );
  }
}
