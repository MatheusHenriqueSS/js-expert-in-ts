import { Base } from "./base/base";

export class CarCategory extends Base {
    carIds: string[];
    price: number;
    constructor({id, name, carIds, price}) {
        super({id, name});

        this.carIds = carIds;
        this.price = price;
    }
}