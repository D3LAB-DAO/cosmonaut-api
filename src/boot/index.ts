import { setPgdb, setTables } from "./db";
import {sleep} from "../utils";

(async function(){
    await setPgdb('db/schema/init.db.sql')
    await sleep(1000)
    setTables('cosmonaut', ['db/schema/init.auth.sql']);
})();
