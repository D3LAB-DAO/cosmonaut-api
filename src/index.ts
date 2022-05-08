import {Server} from 'http'
import 'dotenv/config'

import app from "./app"

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
    



// Test sample
// (async function () {
//     const targetCode: string = "fn main(){println!(\"test function\");}"
//     const encodedData = Buffer.from(targetCode, "utf-8").toString('base64'); // encode a string
//     let res = await rust.fmt(encodedData);
//     console.log(res);
//     console.log(Buffer.from(res, 'base64').toString('utf-8'));
// })();