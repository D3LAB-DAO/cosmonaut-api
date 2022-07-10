import { createWriteStream } from "fs";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import compression from "compression";
import { createClient } from "redis";
import connectredis from "connect-redis";
import httpStatus from "http-status";
import passport from "passport";

import * as dotenv from 'dotenv';
import path from 'path';
if (process.env.NODE_ENV !== 'production') {
    if (process.env.IS_DIST) {
        dotenv.config({path: path.join(__dirname, '..', '..', '.env.dev')});

    } else {
        dotenv.config({path: path.join(__dirname, '..', '.env.dev')});
    }
} else {
    dotenv.config({path: path.join(__dirname, '..', '..', '.env')});
}
import conf from "./config";

import route from "./routes";
import { apiLimiter } from "./middlewares/rate-limit";
import { errorConverter, errorHandler } from "./middlewares/error";
import { APIError } from "@d3lab/types";

const app = express();

app.use(apiLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
const RedisStore = connectredis(session);
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);
const sessOpt: session.SessionOptions = {
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: conf.secret as string,
    resave: false,
    cookie: {},
};


const corsOpts = {
    origin: conf.corsWhiteList,
    credentials: true
};
if (process.env.NODE_ENV == "production") {
    app.use(cors(corsOpts));
    app.set("trust proxy", 1);
    if (sessOpt.cookie) {
        sessOpt.cookie.maxAge = 1000 * 60 * 60 * 2;
        // sessOpt.cookie.secure = true;
    }
    const accessLogStream = createWriteStream(
        path.join(__dirname, "..", "..", "logs/prod", "api-access.log"),
        { flags: "a+" }
    );
    app.use(morgan("combined", { stream: process.stdout }));
} else {
    app.use(cors(corsOpts));
    app.use(morgan("dev")); //log to console on development
}

app.use(session(sessOpt));
app.use(passport.authenticate("session"));
app.locals.redis = redisClient;

app.use(helmet());
app.use(compression());

app.use(
    "/",
    (req, res, next) => {
        next();
    },
    route
);

app.use((req, res, next) => {
    next(new APIError(httpStatus.NOT_FOUND, "Not found"));
});
app.use(errorConverter);
app.use(errorHandler);

export default app;
