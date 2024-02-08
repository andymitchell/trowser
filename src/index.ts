// @ts-nocheck

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
        }
    };
}

export {};