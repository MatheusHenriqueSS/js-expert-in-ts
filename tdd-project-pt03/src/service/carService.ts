import { Base } from "../entitites/base/base";
import { Car } from "../entitites/car";
import { CarCategory } from "../entitites/carCategory";
import { Customer } from "../entitites/customer";
import { Tax } from "../entitites/tax";
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



}