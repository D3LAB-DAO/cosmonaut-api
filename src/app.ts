import express from "express";
import cors from "cors";
import route from "./routes";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.json());
const whiteList = ['http://localhost:63342'];
app.use(cors({origin: whiteList}));
app.use('/', route);

export default app