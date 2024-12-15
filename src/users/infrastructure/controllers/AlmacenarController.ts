import { APIGatewayProxyHandler } from "aws-lambda";
import { handleError, CustomError } from "../../../utils/errorHandler";
import { CustomDataService } from "../../application/CustomDataService";
import { DynamoCustomDataRepository } from "../repositories/DynamoCustomDataRepository";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    if (!body.type || !body.content) {
      throw new CustomError("El campo 'type' y 'content' son obligatorios.", 400);
    }

    const dynamoCustomDataRepository = new DynamoCustomDataRepository();
    const service = new CustomDataService(dynamoCustomDataRepository);

    await service.storeCustomData(body);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "¡Datos almacenados exitosamente!" }),
    };
  } catch (error) {
    return handleError(error);
  }
};
