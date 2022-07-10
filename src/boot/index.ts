import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({path: path.join(process.cwd(), '.env.dev')})

import { setPgdb, runSQL} from "./db";
import {sleep} from "../utils";

(async function(){
    const flags = process.argv.slice(2);
    for (let f of flags) {
        if (f === "--init") {
            await setPgdb('db/schema/init.db.sql');
            await sleep(1000);
        }
    }

    await runSQL('cosmonaut', ['db/schema/clean.sql'], ';');
    await runSQL('cosmonaut', ['db/schema/init.tb.sql'], ';');
    await runSQL('cosmonaut', ['db/schema/logic.sql'], '##');
})();
