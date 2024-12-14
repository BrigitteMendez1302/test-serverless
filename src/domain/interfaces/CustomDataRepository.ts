export interface CustomDataRepository {
    storeCustomData(data: { type: string; content: Record<string, unknown> }): Promise<void>;
}