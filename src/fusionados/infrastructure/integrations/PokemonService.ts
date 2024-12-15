import { PokemonAPI } from "../../domain/repositories/PokemonRepository";
import { Planet } from "../../domain/entities/Planet";
import { Pokemon } from "../../domain/entities/Pokemon";
import { Habitat } from "../../domain/entities/Habitat";
import axios from 'axios';
import { CacheRepository } from "../repositories/CacheRepository";

export class PokemonService implements PokemonAPI {
  private readonly baseURL = 'https://pokeapi.co/api/v2/pokemon-habitat/';
  private readonly cacheRepository: CacheRepository;

  constructor() {
    this.cacheRepository = new CacheRepository();
  }

  async getEnrichedHabitats(planets: Planet[]) : Promise<Record<string, string[]>> {

    const climateToHabitatMap: Record<string, string> = {
      arid: "rough-terrain",
      temperate: "grassland",
      frozen: "mountain",
      tropical: "forest",
      ocean: "sea",
      rocky: "rough-terrain",
      swamp: "waters-edge",
    };

    const uniqueClimates = Array.from(
      new Set(planets.map((planet) => planet.climate.split(",")[0].trim()))
    );

    const uniqueHabitats = Array.from(
      new Set(
        uniqueClimates.map((climate) => ({
          climate,
          habitat: climateToHabitatMap[climate] || "rare",
        }))
      )
    );

    const cacheKeyHabitatList = "pokemon_habitat_list";
    let allHabitats: Habitat[];

    const cachedHabitatList = await this.cacheRepository.get<Habitat[]>(cacheKeyHabitatList);
    if (cachedHabitatList) {
      allHabitats = cachedHabitatList;
    } else {
      const habitatListResponse = await axios.get(this.baseURL);
      allHabitats = habitatListResponse.data.results;
      await this.cacheRepository.set(cacheKeyHabitatList, allHabitats, 1800); // TTL de 30 minutos
    }

    const habitatUrlMap = Object.fromEntries(
      allHabitats.map((habitat: Habitat) => [habitat.name, habitat.url])
    );

    const habitatDetails = await Promise.all(
      uniqueHabitats
        .filter((item) => habitatUrlMap[item.habitat])
        .map(async (item) => {
          const cacheKey = `pokemon_habitat_${item.habitat}`;
          const cachedData = await this.cacheRepository.get<{ climate: string; pokemon: string[] }>(cacheKey);

          if (cachedData) {
            console.log(`Habitat ${item.habitat} obtenido del caché.`);
            return cachedData;
          }

          const response = await axios.get(habitatUrlMap[item.habitat]);
          const pokemonSpecies: Pokemon[] = response.data.pokemon_species;

          const habitatData = {
            climate: item.climate,
            pokemon: pokemonSpecies.map((p: Pokemon) => p.name),
          };

          await this.cacheRepository.set(cacheKey, habitatData, 1800);

          return habitatData;
        })
    );

    const climateToPokemonMap = Object.fromEntries(
      habitatDetails.map((h) => [h.climate, h.pokemon])
    );

    return climateToPokemonMap;
  }
}
