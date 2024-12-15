import { StarWarsAPI } from "../../domain/repositories/StarWarsRepository";
import { SwapiCharacter } from "../../domain/entities/SwapiCharacter";
import { Planet } from "../../domain/entities/Planet";
import axios from 'axios';

export class StarWarsService implements StarWarsAPI {
  private readonly baseURL = 'https://swapi.info/api/'

  async getCharacters(): Promise<SwapiCharacter[]> {
    const response = await axios.get(`${this.baseURL}people/`);
    return response.data.map((character: SwapiCharacter) => ({
      name: character.name,
      homeworld: character.homeworld,
    }));
  }

  async getEnrichedPlanets(characters: SwapiCharacter[]): Promise<Record<string, Planet>> {
    const planetUrls = characters.map((character) => character.homeworld);
    const uniquePlanetUrls = Array.from(new Set(planetUrls)); // Filtrar planetas únicos

    const planetDetails = await Promise.all(
      uniquePlanetUrls.map(async (url) => {
        const response = await axios.get(url);
        return {
          url,
          name: response.data.name,
          climate: response.data.climate,
        } as Planet;
      })
    );

    return Object.fromEntries(
      planetDetails.map((planet) => [planet.url, planet])
    );
  }
}
