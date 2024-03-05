// @ts-nocheck

import {isEqual} from 'lodash-es';

window.describe = (description: string, fn: () => void) => {
    console.log(description);
    fn();
}

window.test = async (testName: string, fn: () => void) => {
    try {
        console.log(`Test ${testName}`);
        await fn();
        console.log(`Test ${testName} passed`);
    } catch (error) {
        console.error(`Test failed: ${error}`);
    }
}


window.expect = (a: any) => {
    const state = {a};
    const testers = {
        toBe: (b: any) => {
            if (state.a !== b) {
                throw new Error(`Expected ${a} to be ${b}`);
            }
        },
        toEqual: (b: any) => {
            if( !isEqual(state.a, b) ) {
                throw new Error(`Expected ${JSON.stringify(state.a)} to be ${JSON.stringify(b)}`);
            }
        }
    };

    if( state.a instanceof Promise ) {
        Object.keys(testers).forEach(key => {
            const prev = testers[key];
            testers[key] = async (...args:any[]) => {
                state.a = await state.a;
                return prev(...args);
            }
        });
    }

    return testers;
}

export {};