/// <reference path="index.d.ts" />

import sleep from "../src/utils/sleep";



let runnable1 = false;
let runnable2 = false;
beforeAll((done) => {
    setTimeout(() => {
        runnable1 = true;
        done();
    }, 100);
})
beforeAll(async () => {
    await sleep(100);
    runnable2 = true;
})

afterAll(() => {
    console.log("Fire after all");
})


describe('BeforeAll  ', () => {
    test('BeforeAll called before any test', () => {
        


        expect(runnable1).toBe(true);
        expect(runnable2).toBe(true);
    })
})

describe('Grouping 1', () => {
    test('Test 1', () => {
        

        expect(1).toBe(1);
        expect({a: 1}).toEqual({a: 1});
    })
})



describe('Async test', () => {
    async function getUserName(userID) {
        return 'bob';
    }

    test('Async Test 1', () => {
        expect(getUserName('')).toBe('bob');
    })

    test('Async Test 2', async () => {
        const un = await getUserName('');
        expect(un).toBe('bob');
    })
})