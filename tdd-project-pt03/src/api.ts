import { Car } from "./entitites/car";
import { CarCategory } from "./entitites/carCategory";
import { CarService } from "./service/carService";
import * as http from "http";
import { Customer } from "./entitites/customer";
import { join } from "path";

const DEFAULT_HEADER = {'Content-Type': 'application/json'};
const DEFAULT_PORT = 3000;

export class Api {
    carService: CarService;
    constructor() {
        this.carService = new CarService({cars: join(__dirname, "./../database/cars.json")});
    }

    generateRoutes() {
        return {
            '/get-available-car:post': async (req: http.IncomingMessage, res: http.ServerResponse) => {
                    let body = '';

                    req.on('data', chunk => {
                        body += chunk.toString();
                    }) 

                    req.on('end', async () => {
                        try {
                            const { data } = JSON.parse(body); 

                            if(!data.carCategory) {
                                throw new Error("Missing carCategory!");
                            }

                            const carCategory = new CarCategory(data.carCategory);

                            const car = await this.carService.getAvailableCar(carCategory);

                            if(!car.id)throw new Error("Could not find car.");

                            res.write(JSON.stringify({car}));
                            return res.end();   
                        } catch(err) {
                            console.log("error", err);
                            res.writeHead(500, DEFAULT_HEADER);
                            res.write(JSON.stringify({error: "true", message: err.message}));
                            return res.end();
                        }
                    })
            },
            '/calculate-final-price:post': (req: http.IncomingMessage, res: http.ServerResponse) => {
                let body = '';

                req.on('data', chunk => {
                    body += chunk.toString();
                }) 

                req.on('end', async () => {
                    try {
                        
                        const { data } = JSON.parse(body); 

                        if(!data.carCategory || !data.customer || !data.numberOfDays) {
                            throw new Error("Missing required properties!");
                        }

                        const carCategory = new CarCategory(data.carCategory);
                        const customer = new Customer(data.customer);
                        const numberOfDays: number = data.numberOfDays;

                        const finalPrice = this.carService.calculateFinalPrice(carCategory, customer, numberOfDays);

                        res.write(JSON.stringify({finalPrice}));
                        return res.end();   
                    } catch(err) {
                        console.log("error", err);
                        res.writeHead(500, DEFAULT_HEADER);
                        res.write(JSON.stringify({error: "true", message: err.message}));
                        return res.end();   
                    }
                })
            },
            '/rent:post': (req: http.IncomingMessage, res: http.ServerResponse) => {
                let body = '';

                req.on('data', chunk => {
                    body += chunk.toString();
                }) 

                req.on('end', async () => {
                    try {
                        
                        const { data } = JSON.parse(body); 

                        if(!data.carCategory || !data.customer || !data.numberOfDays) {
                            throw new Error("Missing required properties!");
                        }

                        const carCategory = new CarCategory(data.carCategory);
                        const customer = new Customer(data.customer);
                        const numberOfDays: number = data.numberOfDays;

                        const receipt = await this.carService.rent(carCategory, customer, numberOfDays);

                        res.write(JSON.stringify({receipt}));
                        return res.end();   
                    } catch(err) {
                        console.log("error", err);
                        res.writeHead(500, DEFAULT_HEADER);
                        res.write(JSON.stringify({error: "true", message: err.message}));
                        return res.end();   
                    }
                })
            },
            default: (req: http.IncomingMessage, res: http.ServerResponse) => {
                res.write(JSON.stringify({ success: 'Hello World!' }))
                return res.end();
            }
        }
    }

    handler(req: http.IncomingMessage, res: http.ServerResponse) {
        const { url, method } = req;
        const routeKey = `${url}:${method.toLowerCase()}`;   
        const routes = this.generateRoutes();   

        const chosen = routes[routeKey];
        res.writeHead(200, {'Content-Type': 'application/json'});

        return chosen(req, res);
    }

    initialize(port = DEFAULT_PORT) {
        const app = http.createServer(this.handler.bind(this)).listen(port, () => console.log("Server started sucessfully!"))
        
        return app;
    }
}

if (process.env.NODE_ENV !== 'test') {
    const api = new Api()
    api.initialize()
}

const api = () => new Api();

export default api;
