

import {isEqual} from 'lodash-es';
import sleep from '../src/utils/sleep';
window.Buffer = require('buffer/').Buffer

const beforeAllPromises:Promise<void>[] = [];
const afterAllPromises:Promise<void>[] = [];
const testPromises:Promise<void>[] = [];

/*
window.beforeAll = (callback:(done?:Function) => void | Promise<void>) => {
    const state:{trigger:Function | undefined} = {};
    const donePromise = new Promise<void>(resolve => {
        state.trigger = resolve;
    })
    await callback(() => state.trigger());
    await donePromise;
}
*/
window.beforeAll = (callback:(done?:Function) => void | Promise<void>, timeout:number = 5000):void => {
    const state:{trigger?:Function, clearTimeout?:Function} = {};
    const donePromise = new Promise<void>((resolve, reject) => {
        let timeoutId = setTimeout(() => {
            reject(new Error("Timeout occurred while waiting for beforeAll"));
        }, timeout);

        state.clearTimeout = () => {
            clearTimeout(timeoutId);
        }

        state.trigger = () => {
            state.clearTimeout();
            resolve();
        }

    });

    const done = () => {
        state.trigger();
    };

    const result = callback(done);
    
    if (result instanceof Promise) {
        state.clearTimeout();
        beforeAllPromises.push(result);
    } else if (result !== undefined) {
        beforeAllPromises.push(donePromise);
    }
};

async function canStartTest() {
    await Promise.all(beforeAllPromises);
}

window.afterAll = async (callback:(done?:Function) => void | Promise<void>, timeout:number = 5000):Promise<void> => {
    await sleep(200);
    await Promise.all(testPromises);

    const state:{trigger?:Function, clearTimeout?:Function} = {};
    const donePromise = new Promise<void>((resolve, reject) => {
        let timeoutId = setTimeout(() => {
            reject(new Error("Timeout occurred while waiting for beforeAll"));
        }, timeout);

        state.clearTimeout = () => {
            clearTimeout(timeoutId);
        }

        state.trigger = () => {
            state.clearTimeout();
            resolve();
        }

    });

    const done = () => {
        state.trigger();
    };

    const result = callback(done);
    
    if (result instanceof Promise) {
        state.clearTimeout();
        afterAllPromises.push(result);
    } else if (result !== undefined) {
        afterAllPromises.push(donePromise);
    }
};

window.describe = (description: string, fn: () => void) => {
    console.log(description);
    fn();
}

window.test = async (testName: string, fn: () => void | Promise<void>) => {
    const state:{trigger?:Function} = {};
    testPromises.push(new Promise(resolve => {
        state.trigger = resolve;
    }));

    await canStartTest();
    try {
        console.log(`Testing '${testName}'`);
        await fn();
        console.log(`Test '${testName}' passed OK`);
    } catch (error) {
        console.error(`Test '${testName}' failed:\n${error}`);
    }
    state.trigger();
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