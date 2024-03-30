/// <reference path="index.d.ts" />

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