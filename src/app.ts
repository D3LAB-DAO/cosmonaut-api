import express from "express";
import cors from "cors";

import route from "./routes";
import rustRoute from './routes/rust'

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.json());

if (process.env.MODE === "test") {
    app.use(cors())
} else {
    const whiteList = ['http://localhost:63342'];
    app.use(cors({origin: whiteList}));
}

app.use('/', route);
app.use('/rust', rustRoute)

export default app