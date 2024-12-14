import { FusionRepository } from "../domain/interfaces/FusionRepository";


export class HistorialService {
  constructor(
    private fusionRepository: FusionRepository
  ) {}

  async getHistory(limit: number, nextToken?: string) {
    // Validar el límite (opcional para evitar problemas)
    if (limit <= 0 || limit > 10) {
      throw new Error("El parámetro 'limit' debe estar entre 1 y 10.");
    }

    // Delegar al repositorio la obtención del historial
    return this.fusionRepository.getFusionHistory(limit, nextToken);
  }
}
