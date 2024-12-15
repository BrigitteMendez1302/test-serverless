import { APIGatewayProxyHandler } from "aws-lambda";
import { HistorialService } from "../../application/HistorialService";
import { DynamoFusionRepository } from '../repositories/DynamoFusionRepository';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const pageSize = parseInt(event.queryStringParameters?.pageSize || "10", 10);
    const npage = parseInt(event.queryStringParameters?.npage || "1", 10);
    const fusionRepository = new DynamoFusionRepository();

    const service = new HistorialService(fusionRepository);
    const result = await service.getHistory(pageSize, npage);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      }),
    };
  }
};
