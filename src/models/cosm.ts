import {Request} from 'express';
import { pg } from "@d3lab/db";


async function getAssetLoc(req: Request): Promise<string|Error> {
    let pgClient;
    try {
        const issuer = req.session.passport?.user.issuer
        const id = req.session.passport?.user.id

        pgClient = await pg.getClient();
        const res = await pgClient.query("SELECT loc FROM assets WHERE provider = $1 AND subject = $2 AND lesson = $3", [issuer, id, req.query.lesson]);
        return res.rows[0]['loc']

    } catch (error) {
        if (error instanceof Error) {
            return error
        } else {
            return new Error("Unexpected error occured during get asset location")
        }
    } finally {
        pgClient?.release();
    }
}

export {
    getAssetLoc
}