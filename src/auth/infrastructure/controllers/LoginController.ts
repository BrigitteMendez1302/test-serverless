import { APIGatewayProxyHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body || "{}");

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email y contraseña son requeridos." }),
      };
    }

    // Parámetros del comando InitiateAuth
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH" as AuthFlowType, // Se asegura que el valor coincida con el tipo esperado
      ClientId: process.env.COGNITO_APP_CLIENT_ID!,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const command = new InitiateAuthCommand(params);
    const response = await cognitoClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: response.AuthenticationResult?.AccessToken,
        idToken: response.AuthenticationResult?.IdToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
        expiresIn: response.AuthenticationResult?.ExpiresIn,
      }),
    };
  } catch (error: any) {
    console.error("Error en login:", error);

    return {
      statusCode: 401,
      body: JSON.stringify({ message: error.message || "Error al autenticar usuario." }),
    };
  }
};
