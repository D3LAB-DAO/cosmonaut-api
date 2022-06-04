import {Request, Response} from "express";
import {rust} from "@d3lab/controllers";
import {Base64} from "@d3lab/types";

describe("Test /rust/* API endpoints",
    () => {
        let mockReq: Partial<Request>;
        let mockRes: Partial<Response>;
        let resObj = {};

        beforeEach(() => {
            mockReq = {
                body: undefined
            };
            mockRes = {
                send: jest.fn().mockImplementation((result) => {
                    resObj = result;
                }),
                json: jest.fn().mockImplementation((result) => {
                    resObj = result;
                })
            }
        });

        test('Test POST /rust/fmt',
            async () => {
                const expectedCode = "success";
                const targetCode1: string = "fn main(){println!(\"test function\");}"
                const encodedData1: Base64 = Buffer.from(targetCode1, "utf-8").toString('base64');
                const targetCode2: string = "fn fizzbuzz(n: u32) -> () { if is_divisible_by(n, 15) { println!(\"fizzbuzz\"); } " +
                    "else if is_divisible_by(n, 3) { println!(\"fizz\"); } else if is_divisible_by(n, 5) { println!(\"buzz\"); } else { println!(\"{}\", n); } }";
                const encodedData2 = Buffer.from(targetCode2, "utf-8").toString('base64');

                const mockReq = {
                    body: {
                        file1: encodedData1,
                        file2: encodedData2
                    }
                }

                const cmpStr1 = "fn main() {\n" +
                    "    println!(\"test function\");\n" +
                    "}\n";
                const cmpStr2 = "fn fizzbuzz(n: u32) -> () {\n" +
                    "    if is_divisible_by(n, 15) {\n" +
                    "        println!(\"fizzbuzz\");\n" +
                    "    } else if is_divisible_by(n, 3) {\n" +
                    "        println!(\"fizz\");\n" +
                    "    } else if is_divisible_by(n, 5) {\n" +
                    "        println!(\"buzz\");\n" +
                    "    } else {\n" +
                    "        println!(\"{}\", n);\n" +
                    "    }\n" +
                    "}\n";
                const encodedCmpStr1 = Buffer.from(cmpStr1, "utf-8").toString('base64');
                const encodedCmpStr2 = Buffer.from(cmpStr2, "utf-8").toString('base64');


                const expectedRes = {
                    code: expectedCode,
                    result: {
                        file1: encodedCmpStr1,
                        file2: encodedCmpStr2
                    }
                }
                await rust.fmtCodes(mockReq as Request, mockRes as Response);

                expect(resObj).toEqual(expectedRes)

            })

    })