import {rust} from '@d3lab/services';

describe("rustfmt test", () => {
    test("with correct rust code",
        async () => {
            const targetCode: string = "fn main(){println!(\"test function\");}"
            const encodedData = Buffer.from(targetCode, "utf-8").toString('base64'); // encode a string
            try {
                let res = await rust.rustfmt(encodedData)
                res = Buffer.from(res, 'base64').toString('utf-8')
                const cmpStr = "fn main() {\n" +
                    "    println!(\"test function\");\n" +
                    "}\n"
                expect(res).toBe(cmpStr)
            } catch (err) {
                if (err instanceof Buffer) {
                    err = err.toString()
                    expect(err).toMatch('error')
                } else if (typeof err === "string") {
                    err = Buffer.from(err, 'base64').toString('utf-8')
                    expect(err).toMatch('error')
                } else {
                    expect(err).toMatch('error')
                }
            }
        })

    test("with wrong rust code",
        () => {
            const wrongCode: string = "Hello I am not rust code"
            const encodedData = Buffer.from(wrongCode, "utf-8").toString('base64');
            return rust.rustfmt(encodedData)
                .catch(err => {
                    let convToUTF8 = Buffer.from(err, 'base64').toString('utf-8')
                    expect(convToUTF8).toMatch('error')
                })

        })
})

