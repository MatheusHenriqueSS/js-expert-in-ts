import { Base } from "./base/base";

export class Customer extends Base {
    age: number;

    constructor({id, name, age}) {
        super({id, name});

        this.age = age;
    }
}