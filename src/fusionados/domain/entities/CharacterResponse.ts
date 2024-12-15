import { Character } from './Character';

export interface CharacterResponse extends Character {
    createdAt: string; // Fecha de creación en formato ISO 8601
  }
  