import { APIGatewayProxyHandler } from 'aws-lambda';
import { StarWarsService } from '../integrations/StarWarsService';
import { PokemonService } from '../integrations/PokemonService';
import { FusionService } from '../../application/FusionService';
import { FusionRepository } from '../repositories/FusionRepository';

export const handler: APIGatewayProxyHandler = async () => {
  const starWarsService = new StarWarsService();
  const pokemonService = new PokemonService();
  const fusionRepository = new FusionRepository();
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
