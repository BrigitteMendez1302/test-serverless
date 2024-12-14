import { CustomDataRepository } from "../domain/interfaces/CustomDataRepository";

export class CustomDataService {

  constructor(
    private repository: CustomDataRepository
  ) {}

  async storeCustomData(data: { type: string; content: Record<string, unknown> }): Promise<void> {
    // Validar el contenido (reglas adicionales si es necesario)
    if (typeof data.type !== "string") {
      throw new Error("El campo 'type' debe ser un string.");
    }
    if (typeof data.content !== "object") {
      throw new Error("El campo 'content' debe ser un objeto.");
    }

    // Transformar datos si es necesario
    const transformedData = {
      ...data,
      metadata: {
        storedBy: "CustomService",
        storedAt: new Date().toISOString(),
      },
    };

    // Delegar al repositorio
    await this.repository.storeCustomData(transformedData);
  }
}
