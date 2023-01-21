import { deepStrictEqual, rejects } from "assert";
import { error } from "./src/constants";
import { FileClass } from "./src/file";



;(async () => {
    {
        const filePath = "./mocks/emptyFile-invalid.csv";
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
        const result = FileClass.csvToJson(filePath);

        await rejects(result, rejection);
    }
    {
        const filePath = './mocks/fourItens-invalid.csv';
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
        const result = FileClass.csvToJson(filePath);

        await rejects(result, rejection);
    }
    {
        const filePath = './mocks/invalid-header.csv';
        const rejection = new Error(error.FILE_HEADER_ERROR_MESSAGE);
        const result = FileClass.csvToJson(filePath);

        await rejects(result, rejection);
    }
    {
        const filePath = './mocks/threeItens-valid.csv';
        const result = await FileClass.csvToJson(filePath);
        const expected = [
            {
                "name": "John",
                "id": 123,
                "profession": "Developer",
                "birthDay": 1998
            },
            {
                "name": "Juninho",
                "id": 321,
                "profession": "Analist",
                "birthDay": 1993
            },
            {
                "name": "Alemao",
                "id": 669,
                "profession": "Lumberjack",
                "birthDay": 2006
            }
        ]

        deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
    }
})()
