import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { JwtService } from '../integrations/JwtService';
import { CustomContext } from './CustomContext';

export const authMiddleware = (handler: Function) => {
  return async (event: APIGatewayProxyEvent, context: CustomContext): Promise<APIGatewayProxyResult> => {
    try {
      const authHeader = event.headers.Authorization || event.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: 'Token no proporcionado o inválido.' }),
        };
      }

      const token = authHeader.split(' ')[1];
      const decoded = JwtService.verifyToken(token);

      // Verifica si el token decodificado es un objeto (JwtPayload)
      if (typeof decoded !== 'object' || decoded === null) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: 'Token inválido o expirado.' }),
        };
      }

      // Adjunta el usuario al contexto
      context.user = decoded;

      // Llama al controlador original
      return await handler(event, context);
    } catch (error) {
      console.error('Error en autenticación:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error interno del servidor.' }),
      };
    }
  };
};
