import {Server} from 'http';
import 'dotenv/config';

import app from "./app";
import {log} from "./config"

let server: Server;

async function init() {
    server = app.listen(process.env.PORT, () => {
        log.opLogger.info(`Listening to ${process.env.PORT}`);
    })
}

init()
    .catch((e) => {
        log.errorLogger.error(`Initial Error : ${e}`)
    })