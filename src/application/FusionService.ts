import { StarWarsService } from '../infrastructure/services/StarWarsService';
import { PokemonService } from '../infrastructure/services/PokemonService';
import { Character } from '../domain/Character';

export class FusionService {
  constructor(
    private starWarsService: StarWarsService,
    private pokemonService: PokemonService
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
    return characters.map((character: Character) => {
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
  }
}
