import {rust} from '../src/rust'

test("test rustfmt",
    async () => {
        const targetCode: string = "fn main(){println!(\"test function\");}"
        const wrongCode: string = "Hello I am not rust code"
        const encodedData = Buffer.from(targetCode, "utf-8").toString('base64'); // encode a string
        const encodedData2 = Buffer.from(wrongCode, "utf-8").toString('base64');

        try {
            let res = await rust.fmt(encodedData)
            res = Buffer.from(res, 'base64').toString('utf-8')
            const cmp_str = "fn main() {\n" +
                "    println!(\"test function\");\n" +
                "}\n"
            expect(res).toBe(cmp_str)
            let res2 = await rust.fmt(encodedData2)
        } catch(err) {
            if (err instanceof  Buffer) {
                err = err.toString()
                expect(err).toMatch('error')
            } else if(typeof err === "string") {
                err = Buffer.from(err, 'base64').toString('utf-8')
                console.error(err)
                expect(err).toMatch('error')
            } else {
                expect(err).toMatch('error')
            }
        }
    })

// (async function () {
//     const targetCode: string = "fn main(){println!(\"test function\");}"
//     const wrongCode: string = "Hello I am not rust code"
//     const encodedData = Buffer.from(targetCode, "utf-8").toString('base64'); // encode a string
//     const encodedData2 = Buffer.from(wrongCode, "utf-8").toString('base64');
//     try {
//         // let res = await rust.fmt(encodedData);
//         // console.log(res);
//         // console.log(Buffer.from(res, 'base64').toString('utf-8'));
//         let res2 = await rust.fmt(encodedData2);
//         console.log(res2);
//         console.log(Buffer.from(res2, 'base64').toString('utf-8'));
//     } catch(err) {
//         if (err instanceof Buffer) {
//             console.error(err.toString())
//         } else {
//             console.error(err)
//         }
//     }
// })();