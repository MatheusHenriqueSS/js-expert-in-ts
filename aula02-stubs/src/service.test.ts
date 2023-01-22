import { Service } from "./service";
const BASE_URL_1 = "https://swapi.dev/api/planets/1";
const BASE_URL_2 = "https://swapi.dev/api/planets/2";
import tatooine from "./../mocks/tatooine.json";
import alderaan from "./../mocks/alderaan.json";
import sinon from "sinon";
import { deepStrictEqual } from "assert";

const mocks = {
    tatooine,
    alderaan
}


;(async () => {

    // {   
    //     const service = new Service();
    //     const withoutStub = await service.makeRequest(BASE_URL_2);

    //     console.log(JSON.stringify(withoutStub));
    // }

    const service = new Service();
    const stub = sinon.stub(service, "makeRequest");

    stub
        .withArgs(BASE_URL_1)
        .resolves(mocks.tatooine)

    stub
        .withArgs(BASE_URL_2)
        .resolves(mocks.alderaan)

    {
        const expected = {
            "name": "Tatooine",
            "surfaceWater": "1",
            appearedIn: 5
        }

        const result = await service.getPlanets(BASE_URL_1);
        deepStrictEqual(result, expected);
    }
    {
        const expected = {
            "name": "Alderaan",
            "surfaceWater": "40",
            appearedIn: 2
        }

        const result = await service.getPlanets(BASE_URL_2);
        deepStrictEqual(result, expected);
    }

})()
