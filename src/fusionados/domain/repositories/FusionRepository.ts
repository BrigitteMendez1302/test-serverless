import { Character } from "../entities/Character";
import { CharacterResponse } from "../entities/CharacterResponse";

export interface FusionRepository {
    saveFusionedData(data: Character[]): Promise<void>;
    getChronologicalRecords(
        pageSize: number,
        npage: number
      ): Promise<{ items: any[]; currentPage: number; totalPages: number; totalItems: number }>;
    getTotalCount(): Promise<number>;
}
