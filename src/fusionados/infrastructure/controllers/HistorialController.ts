import { APIGatewayProxyHandler } from "aws-lambda";
import { handleError, CustomError } from "../../../utils/errorHandler";
import { HistorialService } from "../../application/HistorialService";
import { DynamoFusionRepository } from "../repositories/DynamoFusionRepository";
import { authMiddleware } from "../../../auth/infrastructure/middleware/AuthMiddleware";

const historialHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const pageSize = parseInt(event.queryStringParameters?.pageSize || "10", 10);
    const npage = parseInt(event.queryStringParameters?.npage || "1", 10);

    if (isNaN(pageSize) || isNaN(npage) || pageSize <= 0 || npage <= 0) {
      throw new CustomError("Los parámetros 'pageSize' y 'npage' deben ser números positivos.", 400);
    }

    if (pageSize > 10) {
      throw new CustomError("El valor máximo permitido para 'pageSize' es 10.", 400);
    }

    const fusionRepository = new DynamoFusionRepository();
    const service = new HistorialService(fusionRepository);

    const result = await service.getHistory(pageSize, npage);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return handleError(error);
  }
};

// Exporta el controlador protegido con el middleware de autenticación
export const handler = authMiddleware(historialHandler);
