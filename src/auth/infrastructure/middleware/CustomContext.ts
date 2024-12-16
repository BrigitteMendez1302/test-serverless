import { Context } from 'aws-lambda';

export interface CustomContext extends Context {
  user?: object;
}
