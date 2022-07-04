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
               FIXME: debug 출력메시지는 stderr로 나옴. cliipy나 build 시 오류 발생하면 exit_code: 2
               FIXME: 오류없이 정상 동작 시 exit_code: 0이지만 여전히 debug 메시지는 stderr
               FIXME: clippy 가동 시 수정사항이 나오는 경우 stderr로 debug 메시지 나옴
               FIXME: cosmRun으로 받아온거 fs로 저장해봤는데도 내용 짤려서 저장됨. 무조건 bash script 안에서 해야 모든 상황에서 잘 작동
           */
            if (process.argv[2] == "clippy") {
                res = await rust.cosmRun("clippy", userid, lesson, chapter);
                extracted(path.join(process.cwd(), "cargo-projects", "cosm"), projPath, "debug")
            } else {
                res = await rust.cosmRun("cosm-build", userid, lesson, chapter);
                await sleep(1000)
                const buildout = extracted(path.join(process.cwd(), "cargo-projects", "cosm"), projPath, "out")
                console.log(buildout === "")
            }


        } catch {
            console.log("** exit with non-zero **")
            extracted(path.join(MY_CWD, "cargo-projects", "cosm"), projPath, "debug");
        }
    }
)();