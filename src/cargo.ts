import {spawn} from "child_process";
import fs from "fs";
import path from "path";
import {Base64, CargoReturn} from "@d3lab/types";
import {rust} from "@d3lab/services"

global.MY_CWD = process.cwd();

(async function () {
        let res: CargoReturn;

        function extracted(root: string, userPath: string) {
            const target = path.join(root, "cargo-projects", "cosm", userPath);
            fs.readFile(`${target}/debug`, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(data);
            });
        }

        try {
            /*
               FIXME: debug 출력메시지는 stderr로 나옴. cliipy나 build 시 오류 발생하면 exit_code: 2
               FIXME: 오류없이 정상 동작 시 exit_code: 0이지만 여전히 debug 메시지는 stderr
               FIXME: clippy 가동 시 수정사항이 나오는 경우 stderr로 debug 메시지 나옴
           */
            if (process.argv[2] == "clippy") {
                res = await rust.cosmRun("clippy", "tkxkd0159", "ch3", "lesson1");
                console.log(res)
                extracted(MY_CWD, "tkxkd0159/ch3/lesson1")
            } else {
                res = await rust.cosmRun("cosm-build", "tkxkd0159", "ch3", "lesson1");
                console.log(res);
                console.log(res === "Hello, world!\n" + "I am sub func\n")
            }


        } catch {
            extracted(MY_CWD, "tkxkd0159/ch3/lesson1");
        }
    }
)();
