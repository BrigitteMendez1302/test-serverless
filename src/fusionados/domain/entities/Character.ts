export interface Character {
  name: string;           // Nombre del personaje
  homeworld: string;      // Nombre del planeta (antes era una URL)
  climate: string;        // Clima del planeta
  pokemon_friend?: string[]; // Lista de posibles Pokémon (habilidades del personaje)
}
