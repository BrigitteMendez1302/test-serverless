import { FusionRepository } from "../domain/repositories/FusionRepository";
import { StarWarsAPI } from "../domain/repositories/StarWarsRepository";
import { PokemonAPI } from "../domain/repositories/PokemonRepository";
import { Character } from "../domain/entities/Character";
import { SwapiCharacter } from "../domain/entities/SwapiCharacter";

export class FusionService {
  constructor(
    private starWarsService: StarWarsAPI,
    private pokemonService: PokemonAPI,
    private fusionRepository: FusionRepository
  ) {}

  async getFusionedData(): Promise<Character[]> {
    // Obtener personajes
    const characters: SwapiCharacter[] = await this.starWarsService.getCharacters();

    // Obtener planetas únicos enriquecidos
    const planetMap = await this.starWarsService.getEnrichedPlanets(characters);


    // Obtener mapeo clima -> Pokémon
    const planets = Object.values(planetMap); // Extraer detalles de planetas
    const climateToPokemonMap = await this.pokemonService.getEnrichedHabitats(planets);


    // Enriquecer personajes con Pokémon
    const fusionedCharacters = characters.map((character: SwapiCharacter) => {
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
}
