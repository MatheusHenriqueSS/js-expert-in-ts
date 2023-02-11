import { Base } from "../entitites/base/base";
import { Car } from "../entitites/car";
import { CarCategory } from "../entitites/carCategory";
import { Customer } from "../entitites/customer";
import { Tax } from "../entitites/tax";
import { Transaction } from "../entitites/transaction";
import { BaseRepository } from "../repository/base/baseRepository";

export class CarService {
    carRepository: BaseRepository;
    taxes: {from: number, to: number, then: number}[];
    currencyFormat: Intl.NumberFormat;

    constructor({cars}) {
        this.carRepository = new BaseRepository({file: cars})
        this.taxes = Tax.taxesBasedOnAge;
        this.currencyFormat = new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    getRandomPositonFromArray(data: unknown[]): number {

        return Math.floor(Math.random() * data.length);
    }

    getRandomCar(carCategory: CarCategory): string {
        const randomCarIndex = this.getRandomPositonFromArray(carCategory.carIds);

        return carCategory.carIds[randomCarIndex];
    }

    async getAvailableCar(carCategory: CarCategory): Promise<Car>{
        const carIndex = this.getRandomCar(carCategory);
        const car = await this.carRepository.find(carIndex) as Car;

        return car;
    }

    calculateFinalPrice(carCategory: CarCategory, customer: Customer, numberOfDays: number) {
        const price = carCategory.price;
        const { age } = customer;
        const {then: tax} = this.taxes.find(obj => obj.from <= age && age <= obj.to);
        

        return this.currencyFormat.format((tax * price) * numberOfDays);
    }
    
    
    async rent(carCategory: CarCategory, customer: Customer, numberOfDays: number) {
        const finalPrice = this.calculateFinalPrice(carCategory, customer, numberOfDays);
        const rentedCar = await this.getAvailableCar(carCategory);
        const curDate = new Date();
        curDate.setDate(curDate.getDate() + numberOfDays);
        const dueDate = curDate.toLocaleDateString("pt-br", {year: "numeric", month: "long", day: "numeric"});

        return new Transaction({customer, car: rentedCar, price: finalPrice, dueDate});
    }



}