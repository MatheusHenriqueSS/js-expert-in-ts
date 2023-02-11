export class Tax {
    static get taxesBasedOnAge() {
        return [
            {from: 18, to: 25, then: 1.1},
            {from : 25, to: 30, then: 1.5},
            {from: 31, to: 100, then: 1.3}
        ]
    }
}