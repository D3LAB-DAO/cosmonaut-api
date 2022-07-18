import { Request } from "express";
import { pg } from "@d3lab/db";
import { makeLessonPicturePath } from "@d3lab/utils";

async function getAssetLoc(req: Request): Promise<string> {
    let pgClient;
    try {
        const issuer = req.session.passport?.user.issuer;
        const id = req.session.passport?.user.id;

        pgClient = await pg.getClient();
        const res = await pgClient.query(
            "SELECT loc FROM assets WHERE provider = $1 AND subject = $2 AND lesson = $3",
            [issuer, id, req.query.lesson]
        );
        if (res.rows[0] !== undefined) {
            return res.rows[0]["loc"];
        } else {
            throw new Error("There is no asset to load");
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error(
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
            asset_loc += `/${status}.png`;
        } else if (status === "done") {
            asset_loc += `/${status}.jpg`;
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

async function getProgress(
    req: Request,
    lesson: number
): Promise<{ lesson: number; chapter: number }> {
    const issuer = req.session.passport?.user.issuer;
    const id = req.session.passport?.user.id;
    let pgClient;
    try {
        pgClient = await pg.getClient();
        const res = await pgClient.query(
            "SELECT * FROM get_progress($1, $2, $3)",
            [issuer, id, lesson]
        );

        const progress = res.rows[0];
        if (progress === undefined) {
            return { lesson, chapter: -1 };
        } else {
            return {lesson: res.rows[0]["res_lesson"], chapter: res.rows[0]["res_chapter"]};
        }
    } catch (error) {
        throw error;
    } finally {
        pgClient?.release();
    }
}

async function setProgress(req: Request, lesson: number, chapter: number) {
    const issuer = req.session.passport?.user.issuer;
    const id = req.session.passport?.user.id;
    let pgClient;
    try {
        pgClient = await pg.getClient();
        await pgClient.query("CALL update_lesson($1, $2, $3, $4)", [
            issuer,
            id,
            lesson,
            chapter,
        ]);
    } catch (error) {
        console.error(error);
    } finally {
        pgClient?.release();
    }
}

async function getChapterThreshold(lesson: number): Promise<number|undefined> {
    let pgClient;
    try {
        pgClient = await pg.getClient();
        const res = await pgClient.query(
            "SELECT threshold FROM lesson_range WHERE lesson = $1",
            [lesson]
        );
        return res.rows[0]['threshold']
    } catch (error) {
        console.error(error);
    } finally {
        pgClient?.release();
    }
}

// async function tmp(): Promise<> {
//     let pgClient;
//     try {
//         pgClient = await pg.getClient();
//     } catch (error) {
//         console.error(error);
//     } finally {
//         pgClient?.release();
//     }
// }

export { getAssetLoc, setAssetLoc, getProgress, setProgress, getChapterThreshold };
