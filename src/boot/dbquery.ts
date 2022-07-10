import {Client} from "pg";

import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.join(process.cwd(), '.env.dev')})
import conf from "../config";

(async function(){
    const client = new Client({
        user: conf.pg.user,
        password: conf.pg.pw,
        host: conf.pg.host,
        port: conf.pg.port,
        database: "cosmonaut"
    })
    await client.connect();

    setTimeout(() => {
        console.log("execute settimeout")
        process.exit(0)
    }, 2000);

    try {
        const res = await client.query("SELECT reward as user_asset FROM assets WHERE provider = 'google' AND subject = 'dummy'");
        console.log(res.rows.length === 0)
        console.log(res.rows[0]['user_asset'][1])

        // await client.query("INSERT INTO users(provider, subject, lesson, chapter) VALUES($1, $2, $3, $4)", ['https://accounts.facebook.com', 'tkxkd0159', 1, 1])
        // await client.query("INSERT INTO federated_credentials(provider, subject, name, created_at) VALUES($1, $2, $3, $4)", ['https://accounts.facebook.com', 'tkxkd0159', 'JAESEUNG LEE', new Date().toISOString()])
        // const res2 = await client.query("SELECT * FROM federated_credentials")
        // console.log(res2.rows)


        // Test function & procedure

        // await client.query("CALL update_lesson($1, $2, $3, $4)", ['google', 'tkxkd0159', 0, 10])
        // await client.query("CALL update_lesson($1, $2, $3, $4)", ['facebook', 'tkxkd0159', 2, 10])
        // const res3 = await client.query("SELECT get_chapter($1, $2, $3)", ['google', 'tkxkd0159', 3])
        // console.log(res3.rows[0])
    } catch (error) {
        console.error("error hit: ", error)
    }

})();