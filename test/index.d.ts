

declare global {
    function describe(description: string, fn: () => void): void;
    function test(name: string, fn: () => void): void;
    function expect(value: any): any;
    function beforeAll(callback:(done?:Function) => void | Promise<void>, timeout?:number):void;
    function afterAll(callback:(done?:Function) => void | Promise<void>):void;
}

// This extends the global Window interface
interface Window {
    describe(description: string, fn: () => void): void;
    test(name: string, fn: () => void): void;
    expect(value: any): {
        toBe(expected: any): void;
    };
    beforeAll(callback:(done?:Function) => void | Promise<void>, timeout?:number):void
    afterAll(callback:(done?:Function) => void | Promise<void>):void;
}


export { };