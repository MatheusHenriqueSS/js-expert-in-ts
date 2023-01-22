export class Fibonacci {
    *execute(input: number, current = 0, next = 1): IterableIterator<number> {

        if(input == 0) {
            return 0;
        }

        yield current;

        yield* this.execute(input - 1, next, current + next);
    }
}


;(async () => {
    const fibonacci = new Fibonacci();
    const generator = fibonacci.execute(10);

})()