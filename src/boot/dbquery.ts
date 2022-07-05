import {Client} from "pg";
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

    try {
        const res = await client.query("SELECT reward as user_asset FROM assets WHERE provider = 'google' AND subject = 'tkxkd0159'");
        console.log(res.rows)
        console.log(res.rows[0]['user_asset'])
    } catch (error) {
        console.error("error hit: ", error)
    }

    process.exit(0)

})();