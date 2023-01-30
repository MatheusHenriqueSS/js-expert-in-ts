import { app } from "./api";
import * as request from "supertest";
import {strict as assert} from "assert"


describe("API Suite Tests", () => {
    describe('/contact', () => {
        it('should request the contact page and return HTTP Status 200', async () => {
            const response = await request(app)
                .get('/contact')
                .expect(200)
            assert.deepStrictEqual(response.text, 'contact us page');
        })
    })

    describe('/hello', () => {
        it('should request an inexistent route /hi and redirect to /hello', async () => {
            const response = await request(app)
                .get('/hi')
                .expect(200)
            
            assert.deepStrictEqual(response.text, 'Hello World!')
        })
    })

    describe('/login', () => {
        it('should login sucessfully to the route and return HTTP status 200', async () => {
            const response = await request(app)
                .post("/login")
                .send({username: "eulerdeoja", password: "0708"})
                .expect(200);

            assert.deepStrictEqual(response.text, "Logging has succeeded!");
        })

        it('should fail to login to the route and return HTTP status  401', async () => {
            const response = await request(app)
                .post("/login")
                .send({username: "eulerdja", password: "078"})
                .expect(401);

            assert.ok(response.unauthorized);
            assert.deepStrictEqual(response.text, "Logging failed!");
        })
    })
})
