export interface StarWarsAPI {
    getCharacters(): Promise<any[]>;
    getEnrichedPlanets(characters: any[]): Promise<any>;
  }