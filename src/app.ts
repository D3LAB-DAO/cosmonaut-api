import {createWriteStream} from "fs";
import express from "express";
import cors from "cors";
import morgan from 'morgan';
import helmet from "helmet";
import compression from "compression";

import route from "./routes";
import {apiLimiter} from "./middlewares/rate-limit";


const app = express();
app.use(apiLimiter);
app.use(helmet());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(compression());

if (process.env.NODE_ENV == "production") {
    const whiteList = ['http://localhost:63342'];
    app.use(cors({origin: whiteList}));

    const accessLogStream = createWriteStream(__dirname + '/../logs/prod/' + "access.log", {flags: 'a+'});
    app.use(morgan("combined", {stream: accessLogStream}));
} else {
    app.use(cors())
    app.use(morgan("dev")); //log to console on development
}

app.use('/', route);

export default app