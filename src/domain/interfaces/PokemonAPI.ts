export interface PokemonAPI {
    getEnrichedHabitats(planets: any[]): Promise<Record<string, string[]>>;
}