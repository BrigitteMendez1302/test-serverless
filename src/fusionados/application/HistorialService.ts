import { FusionRepository } from "../domain/repositories/FusionRepository";


export class HistorialService {
  constructor(
    private fusionRepository: FusionRepository
  ) {}

  async getHistory(pageSize: number, npage: number) {
    if (pageSize <= 0 || pageSize > 10) {
      throw new Error("El parámetro 'pageSize' debe estar entre 1 y 10.");
    }

    return this.fusionRepository.getChronologicalRecords(pageSize, npage);
  }
}
