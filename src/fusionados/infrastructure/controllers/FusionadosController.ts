import { APIGatewayProxyHandler } from "aws-lambda";
import { handleError } from "../../../utils/errorHandler";
import { StarWarsService } from "../integrations/StarWarsService";
import { PokemonService } from "../integrations/PokemonService";
import { FusionService } from "../../application/FusionService";
import { DynamoFusionRepository } from "../repositories/DynamoFusionRepository";

export const handler: APIGatewayProxyHandler = async () => {

  try {
    const starWarsService = new StarWarsService();
    const pokemonService = new PokemonService();
    const fusionRepository = new DynamoFusionRepository();
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
