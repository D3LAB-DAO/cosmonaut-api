import './auth'

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

const front = {
    host: process.env.HOST_ADDR,
    login: process.env.HOST_ADDR + "/login.html",
    main: process.env.HOST_ADDR + "/index.html"
}

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    secret: process.env.SECRET_KEY,
    isLocalRust: process.env.LOCAL_RUST_SET,
    corsWhiteList: ["http://127.0.0.1:5501"],
    redis,
    pg,
    front
}

export * as log from './logger'