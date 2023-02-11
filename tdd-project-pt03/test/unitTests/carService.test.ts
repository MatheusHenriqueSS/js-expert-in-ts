import { join } from "path";
import { Car } from "../../src/entitites/car";
import { CarService } from "../../src/service/carService";
import validCarCategory from "../mocks/valid-carCategory";
import validCar from "../mocks/valid-car";
import validCustomer from "../mocks/valid-customer";
import {expect} from "chai";
import * as sinon from "sinon";
const carsDatabase = join(__dirname, "./../../database", "cars.json");

const mocks = {
    validCarCategory,
    validCar,
    validCustomer
}

describe('CarService Suite Tests', () => {
    let carService: CarService;
    let sandbox: sinon.SinonSandbox;
    before(() => {
        carService = new CarService({
            cars: carsDatabase
        })
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    })

    afterEach(() => {
        sandbox.restore();
    })

    it('should retrieve a random position from an array', () => {
        const data = [0, 1, 2, 3, 4];
        const result = carService.getRandomPositonFromArray(data);

        expect(result).to.be.lt(data.length).and.be.gte(0);

    })
    it('should choose the first id from carIds in carCategory', () => {
        const carCategory = mocks.validCarCategory;
        const carIndex = 0;

        const stub = sandbox.stub(carService, "getRandomPositonFromArray").returns(carIndex);


        const result = carService.getRandomCar(carCategory);

        const expected = carCategory.carIds[carIndex];

        expect(stub.calledOnce).to.be.ok;
        expect(result).to.be.deep.equal(expected);
    })
    it('given a CarCategory it should an available car', async () => {
        const car = mocks.validCar;
        //copy object to modify it
        const carCategory = Object.create(mocks.validCarCategory);
        carCategory.carIds = [car.id];

        const stub = sandbox.stub(carService.carRepository, "find").resolves(car);
        const spy = sandbox.spy(carService, "getRandomCar");

        const result = await carService.getAvailableCar(carCategory);

        expect(spy.calledOnce).to.be.ok;
        expect(stub.calledWithExactly(car.id)).to.be.ok;
        expect(result).to.be.deep.equal(car);
    })
    it('given a carCategory, customer and numberOfDays, it should calculate the final amount in real', () => {
        const customer = Object.create(mocks.validCustomer);
        const carCategory = Object.create(mocks.validCarCategory);
        carCategory.price = 37.6;
        const numberOfDays = 5;

        const expected = new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL'
        }).format(244.40);

        sandbox.stub(carService, "taxes").get(() => [{from: 40, to: 50, then: 1.3}]);

        const result = carService.calculateFinalPrice(carCategory, customer, numberOfDays);

        expect(result).to.be.deep.equal(expected);

    })
})