import express from "express";
import cors from "cors";

import route from "./routes";
import {apiLimiter} from "./middlewares/rate-limit";

const app = express();
app.use(apiLimiter)
app.use(express.urlencoded({extended: true}));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
    app.use(cors())
} else {
    const whiteList = ['http://localhost:63342'];
    app.use(cors({origin: whiteList}));
}

app.use('/', route);

export default app