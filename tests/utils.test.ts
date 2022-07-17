import {srcStrip} from "@d3lab/utils"

describe("util functions test",  () => {
    test("src stripper test", () => {

        const tcs = [
                "/home/ljs/ext/sdb/github.com/D3LAB-DAO/cosmonaut/cosmonaut-api/cargo-projects/cosm/github-111/lesson1/ch5/src",
                "/abc/src/dcf/src/asdasd/src/src/adsasda/cosmonaut-api/cargo-prijects/cosm/random/lesson3/ch2/src",
                "/src",
                "/a/src"
            ]

        const ans = [
            "/home/ljs/ext/sdb/github.com/D3LAB-DAO/cosmonaut/cosmonaut-api/cargo-projects/cosm/github-111/lesson1/ch5",
            "/abc/src/dcf/src/asdasd/src/src/adsasda/cosmonaut-api/cargo-prijects/cosm/random/lesson3/ch2",
            "/src",
            "/a"
        ]

        for (let i=0;i<tcs.length;i++) {
            expect(srcStrip(tcs[i])).toBe(ans[i])
        }

    })
})