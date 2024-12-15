import { CustomData } from "../entities/CustomData";
export interface CustomDataRepository {
    storeCustomData(data: CustomData): Promise<void>;
}