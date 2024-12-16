import { APIGatewayProxyHandler } from 'aws-lambda';
import { AuthService } from '../../application/AuthService';
import { DynamoAuthRepository } from '../repositories/DynamoAuthRepository';
import { CustomError, handleError } from '../../../utils/errorHandler';

const authService = new AuthService(new DynamoAuthRepository());

export const signup: APIGatewayProxyHandler = async (event) => {
  const { username, password } = JSON.parse(event.body || '{}');
  try {
    if (!username || !password) {
      throw new CustomError("El nombre de usuario y la contraseña son obligatorios.", 400);
    }

    await authService.signup(username, password);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Usuario registrado exitosamente.' }),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const login: APIGatewayProxyHandler = async (event) => {
  const { username, password } = JSON.parse(event.body || '{}');
  try {
    if (!username || !password) {
      throw new CustomError("El nombre de usuario y la contraseña son obligatorios.", 400);
    }

    const token = await authService.login(username, password);

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    return handleError(error);
  }
};
