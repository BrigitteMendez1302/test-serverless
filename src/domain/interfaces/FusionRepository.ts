import { Character } from "../Character";

export interface FusionRepository {
    saveFusionedData(data: Character[]): Promise<void>;
    getFusionHistory(limit: number, nextToken?: string): Promise<{ items: any[]; nextToken?: string }>;
}
  