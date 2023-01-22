import { Fibonacci } from "./fibonacci"
import * as sinon from "sinon";
import { deepStrictEqual } from "assert";
import { assert } from "console";



;( async () => {
    {
        const fibonacci = new Fibonacci();
        const spy = sinon.spy(fibonacci, "execute");
        

        for await (const i of fibonacci.execute(3)) {}

        const expectedCallCount = 4;

        deepStrictEqual(expectedCallCount, spy.callCount);

    }
    {
        const fibonacci = new Fibonacci();
        const spy = sinon.spy(fibonacci, "execute");
        const [...results] = fibonacci.execute(5);
        //5, 0 1
        //4, 1, 1
        //3, 1, 2
        //2, 2, 3
        //1, 3, 5
        //0, 5, 8

        const { args } = spy.getCall(2);

        const expectedResults = [0, 1, 1, 2, 3];
        const expectedParams = Object.values({
            input: 3,
            current: 1, 
            next: 2
        })

        deepStrictEqual(args, expectedParams);
        deepStrictEqual(results, expectedResults);

    }
})()