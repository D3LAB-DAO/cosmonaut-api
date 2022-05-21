import {Server} from 'http';
import 'dotenv/config';

import app from "./app";

let server: Server;
async function init() {
    server = app.listen(process.env.PORT, () => {
        console.log(`Listening to ${process.env.PORT}`);
    })
}

init()
.catch((e) => {
    console.log(`Initial Error : ${e}`)
})