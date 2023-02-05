import { readFile } from "fs";

export class BaseRepository {
    file: string;
    constructor({file}) {
        this.file = file;
    }

    async find(itemId: string) {
        return new Promise((resolve, reject) => {
            readFile(this.file, 'utf-8', (err, data) => {
                if(err) {
                    console.log(err);
                    reject(err);
                }
                const content = JSON.parse(data);

                if(!itemId)resolve(content);
    
                resolve(content.find(({id}) => id === itemId));
            });
    

        })


    }
}