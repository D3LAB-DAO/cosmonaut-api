import {createWriteStream} from "fs";
import express from "express";
import cors from "cors";
import morgan from 'morgan';
import helmet from "helmet";
import cookieParser from 'cookie-parser';
import session from "express-session";
import compression from "compression";
import {createClient} from "redis";
import connectredis from 'connect-redis';
import httpStatus from "http-status";

import route from "./routes";
import {apiLimiter} from "./middlewares/rate-limit";
import conf from "./config"
import { errorConverter, errorHandler } from "./middlewares/error";
import { APIError } from "@d3lab/types";



const app = express();
app.use(apiLimiter);
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cookieParser());
const RedisStore = connectredis(session)
let redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)
const sessOpt: session.SessionOptions = {
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: conf.secret as string,
    resave: false,
    cookie: {}
}

if (process.env.NODE_ENV == "production") {
    app.set('trust proxy', 1);
    if (sessOpt.cookie) {
        sessOpt.cookie.maxAge = 1000 * 60 * 60 * 2;
        sessOpt.cookie.secure = true;
    }
    const whiteList = ['http://localhost:5500'];
    app.use(cors({origin: whiteList}));

    const accessLogStream = createWriteStream(__dirname + '/../../logs/prod/' + "access.log", {flags: 'a+'});
    app.use(morgan("combined", {stream: accessLogStream}));
} else {
    app.use(cors())
    app.use(morgan("dev")); //log to console on development
}
app.use(session(sessOpt))
app.locals.redis = redisClient;

app.use(helmet());
app.use(compression());


app.use('/', (req, res, next) => {
    if (!req.session.user) {
        req.session.user = "LJS"
    }
    next();
},
route);

app.use((req, res, next) => {
    next(new APIError(httpStatus.NOT_FOUND, "Not found"));
});
app.use(errorConverter);
app.use(errorHandler);

export default app