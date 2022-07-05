import path from "path";
import {Base64, CargoReturn} from "@d3lab/types";
import {rust} from "@d3lab/services"
import {sleep, extracted} from "@d3lab/utils"

global.MY_CWD = process.cwd();

(async function () {
        let res: CargoReturn;



        const userid = 'tkxkd0159'
        const lesson = 'lesson1'
        const chapter = 'ch1'
        const projPath =  `${userid}/${lesson}/${chapter}`
        try {
            /*
               FIXME: debug 출력메시지는 stderr로 나옴. cliipy나 build 시 오류 발생하면 exit_code: 2 -> try to merge stderr with stdout using "&>"
               FIXME: clippy 가동 시 수정사항이 나오는 경우 stderr로 debug 메시지 나옴
               FIXME: docker로 빌드할 때 stdout 안나오는 문제는 stdout를 attach 안해준 문제. stdout을 attach하면 background execute 못함
           */
            if (process.argv[2] == "clippy") {
                res = await rust.cosmRun("clippy", userid, lesson, chapter);
                extracted(path.join(process.cwd(), "cargo-projects", "cosm"), projPath, "debug")
            } else {
                res = await rust.cosmRun("cosm-build", userid, lesson, chapter);
                console.log(res)
            }


        } catch(error) {
            console.log("** exit with non-zero **")
            console.log(error)
        }
    }
)();
