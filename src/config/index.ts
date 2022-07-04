import * as dotenv from 'dotenv';
import path from 'path';

declare module 'express-session' {
  export interface SessionData {
    user: string;
    jwt: string;
  }
}

dotenv.config({path: path.join(__dirname, '..', '..', '.env.dev')});


export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    secret: process.env.SECRET_KEY,
}

export * as log from './logger'