import { CarCategory } from "../src/entitites/carCategory";
import { faker } from "@faker-js/faker";
import { Car } from "../src/entitites/car";
import { writeFile } from "fs";
import { join } from "path";
import { Customer } from "../src/entitites/customer";

const ITEMS_AMOUNT = 3;
const seederBaseFolder = join(__dirname, "../", "database");

const carCategory = new CarCategory({
    id: faker.datatype.uuid(),
    name: faker.vehicle.type(),
    carIds: [],
    price: faker.finance.amount(20, 100)
})


const cars: Car[] = [];
const customers: Customer[] = [];

for (let index = 0; index < ITEMS_AMOUNT; index++) {
    const car = new Car({
        id: faker.datatype.uuid(),
        name: faker.vehicle.model(),
        releaseYear: faker.date.past().getFullYear(),
        available: true,
        gasAvailable: true
    })

    carCategory.carIds.push(car.id);
    cars.push(car);

    const customer = new Customer({
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        age: faker.datatype.number({min: 18, max: 50})
    })

    customers.push(customer);
}



const write = async (filename, data) => writeFile(join(seederBaseFolder, filename), JSON.stringify(data, null, "\t"), (err) => {
    if(err) console.log(err);
})

;(async () => {
    await write("cars.json", cars);
    await write("carCategories.json", [carCategory]);
    await write("customers.json", customers);
})()