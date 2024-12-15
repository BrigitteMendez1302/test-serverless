// errorHandler.ts
export class CustomError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      Object.setPrototypeOf(this, CustomError.prototype);
    }
}
  
export const handleError = (error: any) => {
  if (error instanceof CustomError) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({ error: "Ocurrió un error inesperado." }),
  };
};
  