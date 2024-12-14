import { APIGatewayProxyHandler } from "aws-lambda";
import { HistorialService } from "../../application/HistorialService";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const limit = parseInt(event.queryStringParameters?.limit || "10", 10);
    const nextToken = event.queryStringParameters?.nextToken;

    const service = new HistorialService();
    const result = await service.getHistory(limit, nextToken);

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
