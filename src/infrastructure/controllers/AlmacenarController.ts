import { APIGatewayProxyHandler } from "aws-lambda";
import { CustomDataService } from "../../application/CustomDataService";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    // Validar los campos requeridos
    if (!body.type || !body.content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El campo 'type' y 'content' son obligatorios." }),
      };
    }

    const service = new CustomDataService();
    await service.storeCustomData(body);

    // Respuesta exitosa
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "¡Datos almacenados exitosamente!" }),
    };
  } catch (error) {
    // Manejo de errores
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      }),
    };
  }
};
