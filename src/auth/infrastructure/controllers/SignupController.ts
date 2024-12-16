import { APIGatewayProxyHandler } from "aws-lambda";
import { 
  CognitoIdentityProviderClient, 
  SignUpCommand,
  AdminConfirmSignUpCommand
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

    const params = {
      ClientId: process.env.COGNITO_APP_CLIENT_ID!, // App Client ID (de tu User Pool)
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
      ],
    };

    // Ejecutar SignUp
    const signUpResponse = await cognitoClient.send(new SignUpCommand(params));

    // Confirmar el usuario automáticamente (requiere tener permisos y el UserPoolId)
    await cognitoClient.send(new AdminConfirmSignUpCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!, // Debes establecer este valor en tus variables de entorno
      Username: email,
    }));

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Usuario creado y confirmado exitosamente",
        userSub: signUpResponse.UserSub,
      }),
    };

  } catch (error: any) {
    console.error("Error al registrar usuario:", error);

    const message = error.message || "Error al registrar usuario.";
    return {
      statusCode: 400,
      body: JSON.stringify({ message }),
    };
  }
};
