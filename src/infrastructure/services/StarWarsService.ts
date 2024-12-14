import axios from 'axios';

export class StarWarsService {
  private readonly baseURL = 'https://swapi.dev/api/';

  async getCharacters() {
    const response = await axios.get(`${this.baseURL}people/`);
    return response.data.results; // Devuelve la lista de personajes
  }

  async getEnrichedPlanets(characters: any[]) {
    const planetUrls = characters.map((character) => character.homeworld);
    const uniquePlanetUrls = Array.from(new Set(planetUrls)); // Filtrar planetas únicos

    const planetDetails = await Promise.all(
      uniquePlanetUrls.map(async (url) => {
        const response = await axios.get(url);
        return {
          url,
          name: response.data.name,
          climate: response.data.climate,
          terrain: response.data.terrain,
        };
      })
    );

    return Object.fromEntries(
      planetDetails.map((planet) => [planet.url, planet])
    );
  }
}
