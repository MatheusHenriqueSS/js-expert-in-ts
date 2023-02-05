import { Base } from "../entitites/base/base";
import { Car } from "../entitites/car";
import { CarCategory } from "../entitites/carCategory";
import { BaseRepository } from "../repository/base/baseRepository";

export class CarService {
    carRepository: BaseRepository;

    constructor({cars}) {
        this.carRepository = new BaseRepository({file: cars})
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

}