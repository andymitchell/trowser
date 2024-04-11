// @ts-nocheck

import {isEqual} from 'lodash-es';
window.Buffer = require('buffer/').Buffer

window.describe = (description: string, fn: () => void) => {
    console.log(description);
    fn();
}

window.test = async (testName: string, fn: () => void | Promise<void>) => {
    try {
        console.log(`Testing '${testName}'`);
        await fn();
        console.log(`Test '${testName}' passed OK`);
    } catch (error) {
        console.error(`Test '${testName}' failed:\n${error}`);
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