import axios from 'axios';

export class PokemonService {
  private readonly baseURL = 'https://pokeapi.co/api/v2/pokemon-habitat/';

  async getEnrichedHabitats(planets: any[]) {

    const climateToHabitatMap: Record<string, string> = {
      arid: "rough-terrain",
      temperate: "grassland",
      frozen: "mountain",
      tropical: "forest",
      ocean: "sea",
      rocky: "rough-terrain",
      swamp: "waters-edge",
    };

    // Paso 1: Obtener climas únicos
    const uniqueClimates = Array.from(
      new Set(planets.map((planet) => planet.climate.split(",")[0].trim()))
    );

    // Traducir climas únicos a hábitats únicos
    const uniqueHabitats = Array.from(
      new Set(
        uniqueClimates.map((climate) => ({
          climate,
          habitat: climateToHabitatMap[climate] || "rare",
        }))
      )
    );

    // Obtener lista de hábitats disponibles
    const habitatListResponse = await axios.get(this.baseURL);
    const allHabitats = habitatListResponse.data.results;
    const habitatUrlMap = Object.fromEntries(
      allHabitats.map((habitat: any) => [habitat.name, habitat.url])
    );

    // Filtrar hábitats válidos y mapear clima -> Pokémon
    const habitatDetails = await Promise.all(
      uniqueHabitats
        .filter((item) => habitatUrlMap[item.habitat]) // Solo hábitats válidos
        .map(async (item) => {
          const response = await axios.get(habitatUrlMap[item.habitat]);

          return {
            climate: item.climate, // Usar el nombre del clima como clave
            pokemon: response.data.pokemon_species.map((p: any) => p.name),
          };
        })
    );

    // Crear mapeo final de clima -> Pokémon
    const climateToPokemonMap = Object.fromEntries(
      habitatDetails.map((h) => [h.climate, h.pokemon])
    );

    return climateToPokemonMap;
  }
}
