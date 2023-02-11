import { Car } from "./car";
import { Customer } from "./customer";

export class Transaction {
    customer: Customer;
    car: Car;
    price: number;
    dueDate: Date
    constructor({customer, car, price, dueDate}) {
        this.customer = customer,
        this.car = car;
        this.price = price;
        this.dueDate = dueDate;
    }
}