// @ts-nocheck

import {isEqual} from 'lodash-es';

window.describe = (description: string, fn: () => void) => {
    console.log(description);
    fn();
}

window.test = (testName: string, fn: () => void) => {
    try {
        console.log(`Test: ${testName}`);
        fn();
        console.log('Test passed');
    } catch (error) {
        console.error(`Test failed: ${error}`);
    }
}

window.expect = (a: any) => {
    return {
        toBe: (b: any) => {
            if (a !== b) {
                throw new Error(`Expected ${a} to be ${b}`);
            }
        },
        toEqual: (b: any) => {
            if( !isEqual(a, b) ) {
                throw new Error(`Expected ${JSON.stringify(a)} to be ${JSON.stringify(b)}`);
            }
        }
    };
}

export {};