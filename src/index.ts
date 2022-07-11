import { Server } from "http";

import app from "./app";
import { log } from "./config";

let server: Server;

async function init() {
    server = app.listen(process.env.PORT, () => {
        log.opLogger.info(`Start server at ${process.env.PORT}`);
        console.log(`Listening to ${process.env.PORT}`);
    });
}

init().catch((e) => {
    log.errorLogger.error(`Initial Error : ${e}`);
});

const unexpectedErrHandler = (err: Error) => {
    process.env.NODE_ENV === 'development' ? console.error(err) : log.errorLogger.error(err)
    if (server) {
        server.close(() => {
            log.opLogger.info("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

process.on("uncaughtException", unexpectedErrHandler);
process.on("unhandledRejection", unexpectedErrHandler);
process.on("SIGTERM", () => {
    log.opLogger.info("SIGTERM triggered");
    if (server) {
        server.close(() => {
            log.opLogger.info("Server closed");
            process.exit(0);
        });
    }
});
