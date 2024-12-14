import { APIGatewayProxyHandler } from 'aws-lambda';
import { StarWarsService } from '../integrations/StarWarsService';
import { PokemonService } from '../integrations/PokemonService';
import { FusionService } from "../../application/FusionService";
import { DynamoFusionRepository } from '../repositories/DynamoFusionRepository';

export const handler: APIGatewayProxyHandler = async () => {
  const starWarsService = new StarWarsService();
  const pokemonService = new PokemonService();
  const fusionRepository = new DynamoFusionRepository();
  const fusionService = new FusionService(starWarsService, pokemonService, fusionRepository);

  try {
    const data = await fusionService.getFusionedData();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
  
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
  
};
