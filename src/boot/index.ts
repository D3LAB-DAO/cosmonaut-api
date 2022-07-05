import { setPgdb, setTables } from "./db";
import {sleep} from "../utils";

(async function(){
    const flags = process.argv.slice(2);
    console.log(flags)
    for (let f of flags) {
        if (f === "--init") {
            await setPgdb('db/schema/init.db.sql');
            await sleep(1000);
        }
    }

    setTables('cosmonaut', ['db/schema/init.tb.sql']);
})();
