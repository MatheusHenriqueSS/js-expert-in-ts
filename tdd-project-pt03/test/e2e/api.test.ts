import validCarCategory from "../mocks/valid-carCategory";
import validCustomer from "../mocks/valid-customer";
import validCar from "../mocks/valid-car";
import * as sinon from "sinon";
import * as http from "http";
import api from "../../src/api";
import { expect } from "chai";
import * as request from "supertest";
import { Transaction } from "../../src/entitites/transaction";

const DEFAULT_TEST_PORT = 4000;

const mocks = {
    validCarCategory,
    validCustomer,
    validCar
}

describe('Api Suite Tests', () => {
    let sandbox: sinon.SinonSandbox;
    const app = {
        api: null,
        server: null
    }

    before(() => {
        const instance = api();
        
        app.api = instance;
        app.server = instance.initialize(DEFAULT_TEST_PORT);
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    })

    afterEach(() => {
        sandbox.restore();
    })

    it('should make a post to /get-available-car and receive a random car', async () => {
        const carCategory = Object.create(mocks.validCarCategory);
        const car = mocks.validCar;

        carCategory.carIds = [car.id];

        const expected = { car };

        const result = await request(app.server)
            .post("/get-available-car")
            .send({data: {carCategory}})
            .expect(200);
        
        expect(result.body).to.be.deep.equal(expected);

    })
    it('should make a post to /calculate-final-price and receive the final value', async () => {
        const carCategory = Object.create(mocks.validCarCategory);
        const car = mocks.validCar;
        const customer = Object.create(mocks.validCustomer);
        carCategory.price = 37.6;
        customer.age = 50;

        const numberOfDays = 5;

        const result = await request(app.server)
            .post("/calculate-final-price")
            .send({data: {carCategory, customer, numberOfDays}})
            .expect(200);

        const expected = {finalPrice: app.api.carService.currencyFormat.format(244.4)};

        expect(result.body).to.be.deep.equal(expected);
    }),
    it('should make a post to /rent a receive a receipt as response', async () => {
        const car = mocks.validCar;
        const carCategory = {
            ...Object.create(mocks.validCarCategory),
            price: 37.6,
            carIds: [car.id]
        }
        const numberOfDays = 5;
        const customer = Object.create(mocks.validCustomer)
        customer.age = 50;

        const curDate = new Date(2020, 10, 5);
        sandbox.useFakeTimers(curDate);

        const result = await request(app.server)
            .post("/rent")
            .send({ data: {
                customer,
                carCategory,
                numberOfDays
            }})
            .expect(200);
        
        const expectedAmount = app.api.carService.currencyFormat.format(244.4);
        const expectedDueDate = "10 de novembro de 2020";

        const expected = { receipt: new Transaction({customer, car, price: expectedAmount, dueDate:  expectedDueDate})};

        expect(JSON.stringify(result.body)).to.be.deep.equal(JSON.stringify(expected));
    })
})