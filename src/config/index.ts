import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname, '..', '..', '.env.dev')});

const redis = {
    url: `redis://${process.env.REDISHOST}:${process.env.REDISPORT}`
}

const pg = {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    user: process.env.PGUSER,
    pw: process.env.PGPASSWORD,
    dbname: process.env.PGDATABASE
}


export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    secret: process.env.SECRET_KEY,
    isLocalRust: process.env.LOCAL_RUST_SET,
    redis,
    pg
}

export * as log from './logger'