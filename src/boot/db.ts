import fs from "fs/promises";
import path from "path";
import {Client} from "pg";

import conf from "../config";

async function retrieve(delimiter: string, target: string, client: Client) {
    const sqlpath = path.join(__dirname, '..', target);
    const tmp = await fs.readFile(sqlpath, { encoding: 'utf8'});
    const data = tmp.split(delimiter);
    const qset = [];
    for (let q of data) {
        qset.push(q.trim());
    }
    qset.pop();
    for (let q of qset) {
        try {
            await client.query(q);
        } catch (err) {
            console.error(err)
        }
    }
}

async function setPgdb(sqlpath: string) {
    const client = new Client({
        user: conf.pg.user,
        password: conf.pg.pw,
        host: conf.pg.host,
        port: conf.pg.port,
        database: "postgres"
    })
    await client.connect();
    await retrieve(';', sqlpath, client);

    setTimeout(() => {
        client.end();
    }, 1000);
}

async function setTables(dbname: string, sqlpaths: string[]) {
    const client = new Client({
        user: "ljs",
        password: "secret",
        host: "localhost",
        port: 5432,
        database: dbname
    })
    await client.connect();

    for (let p of sqlpaths) {
        await retrieve(';', p, client);
    }

    setTimeout(() => {
        client.end();
    }, 1000);

}

async function setLogics(dbname: string, sqlpaths: string[]) {
    const client = new Client({
        user: "ljs",
        password: "secret",
        host: "localhost",
        port: 5432,
        database: dbname
    })
    await client.connect();

    for (let p of sqlpaths) {
        await retrieve('##', p, client);
    }

    setTimeout(() => {
        client.end();
    }, 1000);

}

export {
    setPgdb,
    setTables,
    setLogics
}