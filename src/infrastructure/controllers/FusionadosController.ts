import { APIGatewayProxyHandler } from 'aws-lambda';
import { StarWarsService } from '../services/StarWarsService';
import { PokemonService } from '../services/PokemonService';
import { FusionService } from '../../application/FusionService';

export const handler: APIGatewayProxyHandler = async () => {
  const starWarsService = new StarWarsService();
  const pokemonService = new PokemonService();
  const fusionService = new FusionService(starWarsService, pokemonService);

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
