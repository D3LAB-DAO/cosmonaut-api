import {Server} from 'http';
import 'dotenv/config';

import app from "./app";
import {opLogger, errorLogger} from "./config/logger"

let server: Server;
async function init() {
    server = app.listen(process.env.PORT, () => {
        opLogger.info(`Listening to ${process.env.PORT}`);
    })
}

init()
.catch((e) => {
    errorLogger.error(`Initial Error : ${e}`)
})