import { Request } from "express";
import { pg } from "@d3lab/db";
import { makeLessonPicturePath } from "@d3lab/utils";

async function getAssetLoc(req: Request): Promise<string | Error> {
    let pgClient;
    try {
        const issuer = req.session.passport?.user.issuer;
        const id = req.session.passport?.user.id;

        pgClient = await pg.getClient();
        const res = await pgClient.query(
            "SELECT loc FROM assets WHERE provider = $1 AND subject = $2 AND lesson = $3",
            [issuer, id, req.query.lesson]
        );
        return res.rows[0]["loc"];
    } catch (error) {
        if (error instanceof Error) {
            error.message = "You can't get this lesson picture";
            return error;
        } else {
            return new Error(
                "Unexpected error occured during get asset location"
            );
        }
    } finally {
        pgClient?.release();
    }
}

async function setAssetLoc(req: Request, status: string) {
    let pgClient;
    try {
        const issuer = req.session.passport?.user.issuer;
        const id = req.session.passport?.user.id;
        const lesson = Number(req.body.lesson);
        let asset_loc = makeLessonPicturePath(lesson);
        if (status === "start" || status === "doing") {
            asset_loc += `/${status}.png`
        } else if (status === "done") {
            asset_loc += `/${status}.jpg`
        }

        pgClient = await pg.getClient();
        await pgClient.query("CALL update_asset($1, $2, $3, $4, $5)", [
            issuer,
            id,
            lesson,
            status,
            asset_loc,
        ]);
    } catch (error) {
        console.error(error);
    } finally {
        pgClient?.release();
    }
}

async function checkLessonRange(lesson: number, chapter: number): Promise<boolean> {
    let pgClient;
    try {
        pgClient = await pg.getClient();
        const res = await pgClient.query("SELECT threshold FROM lesson_range WHERE lesson = $1", [lesson])
        if (res.rows[0]['threshold'] >= chapter && chapter > 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(error);
        return false
    } finally {
        pgClient?.release();
    }
}

export { getAssetLoc, setAssetLoc, checkLessonRange };
