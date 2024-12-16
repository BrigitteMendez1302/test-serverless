import { APIGatewayProxyHandler } from 'aws-lambda';
import { AuthService } from '../../application/AuthService';
import { DynamoAuthRepository } from '../repositories/DynamoAuthRepository';

const authService = new AuthService(new DynamoAuthRepository());

export const signup: APIGatewayProxyHandler = async (event) => {
  const { username, password } = JSON.parse(event.body || '{}');
  try {
    await authService.signup(username, password);
    return { statusCode: 201, body: JSON.stringify({ message: 'Usuario registrado exitosamente.' }) };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return { statusCode: 400, body: JSON.stringify({ message: errorMessage }) };
  }
};

export const login: APIGatewayProxyHandler = async (event) => {
  const { username, password } = JSON.parse(event.body || '{}');
  try {
    const token = await authService.login(username, password);
    return { statusCode: 200, body: JSON.stringify({ token }) };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return { statusCode: 401, body: JSON.stringify({ message: errorMessage }) };
  }
};