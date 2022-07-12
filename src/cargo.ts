import path from "path";
import {readdir, readFile} from 'fs/promises'
import {RustFiles, CargoReturn} from "@d3lab/types";
import {rust, cosm} from "@d3lab/services"
import {b64ToStr} from "@d3lab/utils"

global.MY_CWD = process.cwd();

(async function () {
        let res: CargoReturn;


        const prefix = 'cargo-projects/cosm'
        const userid = 'github-41176085'
        const lesson = '1'
        const chapter = '5'
        const projPath =  cosm.getCosmFilePath(prefix, userid, lesson, chapter, true)
        try {
            /*
               FIXME: debug 출력메시지는 stderr로 나옴. cliipy나 build 시 오류 발생하면 exit_code: 2 -> try to merge stderr with stdout using "&>"
               FIXME: clippy 가동 시 수정사항이 나오는 경우 stderr로 debug 메시지 나옴
               FIXME: docker로 빌드할 때 stdout 안나오는 문제는 stdout를 attach 안해준 문제. stdout을 attach하면 background execute 못함
           */

            const filelist = await readdir(projPath)
            const result: RustFiles = {}
            for (let fname of filelist) {
                let fpath = path.join(projPath, fname)
                let code = await readFile(fpath)
                result[fname] = code.toString('base64')
            }
            console.log(result)
            // if (process.argv[2] == "clippy") {
            //     res = await rust.cosmRun("clippy", userid, lesson, chapter);
            // } else {
            //     res = await rust.cosmRun("cosm-build", userid, lesson, chapter);
            //     console.log(res)
            // }


        } catch(error) {
            console.log("** exit with non-zero **")
            console.log(error)
        }
    }
)();
