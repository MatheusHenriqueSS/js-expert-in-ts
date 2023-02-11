import { Base } from "./base/base";

export class Car extends Base {
    releaseYear: number;
    available: boolean;
    gasAvailable: boolean;
    
    constructor({id, name, releaseYear, available, gasAvailable}) {
        super({id, name});

        this.releaseYear = releaseYear
        this.available = available
        this.gasAvailable = gasAvailable
    }
}