import { FusionRepository } from "../domain/repositories/FusionRepository";


export class HistorialService {
  constructor(
    private fusionRepository: FusionRepository
  ) {}

  async getHistory(pageSize: number, npage: number) {
    // Validar el límite (opcional para evitar problemas)
    if (pageSize <= 0 || pageSize > 10) {
      throw new Error("El parámetro 'pageSize' debe estar entre 1 y 10.");
    }

    // Delegar al repositorio la obtención del historial
    return this.fusionRepository.getChronologicalRecords(pageSize, npage);
  }
}
