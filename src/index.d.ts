

declare global {
    function describe(description: string, fn: () => void): void;
    function test(name: string, fn: () => void): void;
    function expect(value: any): any;
}

// This extends the global Window interface
interface Window {
    describe(description: string, fn: () => void): void;
    test(name: string, fn: () => void): void;
    expect(value: any): {
      toBe(expected: any): void;
    };
  }

export {};