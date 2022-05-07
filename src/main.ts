import {rust} from './rust'

console.log(rust.build())
const targetCode: string = "fn main(){println!(\"test function\");}"
const encodedData = Buffer.from(targetCode, "utf-8").toString('base64'); // encode a string
console.log(encodedData);
(async function () {
    let res = await rust.fmt(encodedData);
    console.log(res);
    console.log(Buffer.from(res, 'base64').toString('utf-8'));

})();
