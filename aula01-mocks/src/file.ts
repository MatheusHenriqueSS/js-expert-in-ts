import { readFile } from "fs/promises";
import { Settings } from "http2";
import { error }  from "./constants";
import { User } from "./user";
const DEFAULT_OPTIONS = {
    maxLines: 3,
    fields: ["id","name","profession","age"]
}

export class FileClass {
    static async csvToJson(filePath: string) {
        const content = await FileClass.getFileContent(filePath);
        const validation = FileClass.isValid(content);

        if(!validation.valid) throw new Error(validation.error);

        return this.parseCsvToJson(content);
    }

    static async getFileContent(filePath: string) {
        return (await readFile(filePath)).toString("utf8");
    }

    static isValid(csvString, options=DEFAULT_OPTIONS) {
        const [header, ...fileWithoutHeader] = csvString.split('\n');
        const isHeaderValid = header === options.fields.join(',');
        if(!isHeaderValid) {
            return {
                error: error.FILE_HEADER_ERROR_MESSAGE,
                valid: false
            }
        }

        const isContentLengthAccepted = fileWithoutHeader.length > 0 && fileWithoutHeader.length <= options.maxLines;
        if(!isContentLengthAccepted) {
            return {
                error: error.FILE_LENGTH_ERROR_MESSAGE,
                valid: false
            }
        }

        return { valid: true }
    }

    static parseCsvToJson(csvString) {
        const lines = csvString.split('\n');
        //removes first line and returns it
        const firstLine = lines.shift();
        const header = firstLine.split(',');
        const users = lines.map(line => {
            const elements = line.split(',');
            const result = {
                id: "",
                name: "",
                profession: "",
                age: ""
            };
            for (const index in header) {
                result[header[index]] = elements[index];
            }
            return new User(result);
        })

        return users;
    }
}
