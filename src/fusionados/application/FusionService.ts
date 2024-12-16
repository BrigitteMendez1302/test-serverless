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
    const characters: SwapiCharacter[] = await this.starWarsService.getCharacters();

    const planetMap = await this.starWarsService.getEnrichedPlanets(characters);

    const planets = Object.values(planetMap);
    const climateToPokemonMap = await this.pokemonService.getEnrichedHabitats(planets);


    const fusionedCharacters = characters.map((character: SwapiCharacter) => {
      const planet = planetMap[character.homeworld];
      const climate = planet.climate.split(",")[0].trim();

      const possiblePokemon = climateToPokemonMap[climate] || [];

      return {
        name: character.name,
        homeworld: planet.name,
        climate: planet.climate,
        pokemon_friend: possiblePokemon.slice(0, 5),
      };
    });

    await this.fusionRepository.saveFusionedData(fusionedCharacters);

    return fusionedCharacters;
  }
}
