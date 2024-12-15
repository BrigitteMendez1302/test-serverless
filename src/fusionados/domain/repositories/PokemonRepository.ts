import { Planet } from "../entities/Planet";

export interface PokemonAPI {
    getEnrichedHabitats(planets: Planet[]): Promise<Record<string, string[]>>;
}