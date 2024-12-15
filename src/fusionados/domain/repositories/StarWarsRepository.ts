import { SwapiCharacter } from "../entities/SwapiCharacter";
import { Planet } from "../entities/Planet";

export interface StarWarsAPI {
    getCharacters(): Promise<SwapiCharacter[]>;
    getEnrichedPlanets(characters: SwapiCharacter[]): Promise<Record<string, Planet>>;
}