import {spawn} from "child_process"

type base64 = string

const rust = {
    build: (): string => {
        return "I am rust build function"
    },
    fmt: rustfmt
}

// TODO: Need to make error handling when raw is not rust code
function rustfmt(raw: base64): Promise<base64> {
    // echo "fn main(){println!(\"test function\");}"|rustfmt
    const b64ToStr = Buffer.from(raw, 'base64').toString('utf-8')
    let subprocess = spawn("rustfmt")
    subprocess.stdin.write(b64ToStr)
    subprocess.stdin.end()
    return new Promise((resolve, reject) => {
        subprocess.stdout.on('data', (data) => {
            if (data instanceof Buffer) {
                const cmp_str = "fn main() {\n" +
                    "    println!(\"test function\");\n" +
                    "}\n"
                console.log("Formatting result is ", data.toString() === cmp_str)
                resolve(data.toString('base64'))
            }
        });

        subprocess.stderr.on('data', (err) => {
            if (err instanceof Buffer) {
                reject(err.toString('base64'));
            }
        })

    })
}

export {
    rust
}