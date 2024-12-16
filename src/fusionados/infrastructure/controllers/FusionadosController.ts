import { APIGatewayProxyHandler } from "aws-lambda";
import { handleError } from "../../../utils/errorHandler";
import { StarWarsService } from "../integrations/StarWarsService";
import { PokemonService } from "../integrations/PokemonService";
import { FusionService } from "../../application/FusionService";
import { DynamoFusionRepository } from "../repositories/DynamoFusionRepository";
import { CacheRepository } from "../repositories/CacheRepository";
import { authMiddleware } from "../../../auth/infrastructure/middleware/AuthMiddleware";

const fusionHandler: APIGatewayProxyHandler = async () => {
  try {
    const fusionRepository = new DynamoFusionRepository();
    const cacheRepository = new CacheRepository();
    const starWarsService = new StarWarsService(cacheRepository);
    const pokemonService = new PokemonService(cacheRepository);
    const fusionService = new FusionService(starWarsService, pokemonService, fusionRepository);
    const data = await fusionService.getFusionedData();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return handleError(error);
  }
};

// Envuelve el controlador con el middleware sin cambiar el `serverless.yml`
export const handler = authMiddleware(fusionHandler);
