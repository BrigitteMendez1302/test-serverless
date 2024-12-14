import { StarWarsService } from '../infrastructure/integrations/StarWarsService';
import { PokemonService } from '../infrastructure/integrations/PokemonService';
import { FusionRepository } from '../infrastructure/repositories/FusionRepository';
import { Character } from '../domain/Character';

export class FusionService {
  constructor(
    private starWarsService: StarWarsService,
    private pokemonService: PokemonService,
    private fusionRepository: FusionRepository
  ) {}

  async getFusionedData(): Promise<Character[]> {
    // Obtener personajes
    const characters: Character[] = await this.starWarsService.getCharacters();


    // Obtener planetas únicos enriquecidos
    const planetMap = await this.starWarsService.getEnrichedPlanets(characters);

    // Obtener mapeo clima -> Pokémon
    const planets = Object.values(planetMap); // Extraer detalles de planetas
    const climateToPokemonMap = await this.pokemonService.getEnrichedHabitats(planets);

    // Enriquecer personajes con Pokémon
    const fusionedCharacters = characters.map((character: Character) => {
      const planet = planetMap[character.homeworld];

      // Obtener el clima principal del planeta
      const climate = planet.climate.split(",")[0].trim();

      // Obtener Pokémon asociados al clima
      const possiblePokemon = climateToPokemonMap[climate] || [];

      return {
        name: character.name,
        homeworld: planet.name,
        climate: planet.climate,
        pokemon_friend: possiblePokemon.slice(0, 5), // Limitar a 5 Pokémon
      };
    });

    await this.fusionRepository.saveFusionedData(fusionedCharacters);

    return fusionedCharacters;
  }

  async getHistory(limit: number, nextToken?: string) {
    if (limit <= 0 || limit > 10) {
      throw new Error("El parámetro 'limit' debe estar entre 1 y 10.");
    }

    return this.fusionRepository.getFusionHistory(limit, nextToken);
  }
}
