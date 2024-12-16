import { CustomDataRepository } from "../domain/repositories/CustomDataRepository";
import { CustomData } from "../domain/entities/CustomData";

export class CustomDataService {

  constructor(
    private repository: CustomDataRepository
  ) {}

  async storeCustomData(data: CustomData): Promise<void> {
    if (typeof data.type !== "string") {
      throw new Error("El campo 'type' debe ser un string.");
    }
    if (typeof data.content !== "object" || data.content === null) {
      throw new Error("El campo 'content' debe ser un objeto.");
    }    

    if (!data.createdAt) {
      data.createdAt = new Date().toISOString();
    }

    await this.repository.storeCustomData(data);
  }
}
