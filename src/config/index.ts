import joi from 'joi';
import path from 'path';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    if (process.env.COMPOSE !== undefined) {
    } else {
        dotenv.config({path: path.join(process.cwd(), '.env.dev')});
    }
} else {
    dotenv.config({path: path.join(process.cwd(), '.env')});
}
import './auth'

const envScheme = joi.object({
    PORT: joi.string().min(4).max(5).required(),
    NODE_ENV: joi.string().valid('development', 'production').required(),
    LOCAL_RUST_SET: joi.string().valid('true', 'false').required(),
    SESS_SECRET: joi.string().required(),
    PGHOST: joi.string().required(),
    PGPORT: joi.string().min(4).max(5).required(),
    PGUSER: joi.string().required(),
    PGPASSWORD: joi.string().required(),
    PGDATABASE: joi.string().required(),
    REDISHOST: joi.string().required(),
    REDISPORT: joi.string().min(4).max(5).required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
    GITHUB_CLIENT_ID: joi.string().required(),
    GITHUB_CLIENT_SECRET: joi.string().required(),
    FRONT_HOST_ADDR: joi.string().required(),
    FRONT_MAIN_ADDR: joi.string().required(),
    FRONT_LOGIN_ADDR: joi.string().required(),
    REQ_TIMEOUT: joi.string().required(),
    RUST_TIMEOUT: joi.string().required(),
    TS_NODE_PROJECT: joi.string().required()
}).unknown()

const {value: envs, error: err} = envScheme.validate(process.env)
if(err) {
    console.error(err)
    process.exit(1)
}

const timeout = {
    express: Number(envs.REQ_TIMEOUT),
    rust: Number(envs.RUST_TIMEOUT)
}

const redis = {
    url: `redis://${envs.REDISHOST}:${envs.REDISPORT}`
}

const pg = {
    host: envs.PGHOST,
    port: Number(envs.PGPORT),
    user: envs.PGUSER,
    pw: envs.PGPASSWORD,
    dbname: envs.PGDATABASE
}

const front = {
    main: envs.FRONT_MAIN_ADDR,
    login: envs.FRONT_LOGIN_ADDR
}

export default {
    nodeEnv: envs.NODE_ENV,
    port: envs.PORT,
    sessSecret: envs.SESS_SECRET,
    isLocalRust: envs.LOCAL_RUST_SET,
    corsWhiteList: [/127\.0\.0\.1/, envs.FRONT_HOST_ADDR],
    timeout,
    redis,
    pg,
    front
}

export * as log from './logger'