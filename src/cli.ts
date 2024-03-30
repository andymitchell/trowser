#!/usr/bin/env node
"use strict";

import main from './setupTest';
import { Platform, isPlatform } from './types';



let watchMode = false;
let fileToWatch = '';
let platform:Platform | undefined = undefined;

for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--watch') {
        watchMode = true;
    } else if (process.argv[i] === '--file' && i + 1 < process.argv.length) {
        // Assumes that the `--file` option is always followed by the filename
        fileToWatch = process.argv[i + 1];
        i++;  // Skip the next element, which we've just read
    } else if (process.argv[i] === '--platform' && i + 1 < process.argv.length) {
        // Assumes that the `--platform` option is always followed by the platform choice
        const platformRaw = process.argv[i + 1];
        //if( !['browser', 'neutral', 'node'].includes(platformRaw) ) {
        if( !isPlatform(platformRaw) ) {
            throw new Error("Unsupported platform. See https://esbuild.github.io/api/#platform");
        }
        platform = platformRaw;
        i++;  // Skip the next element, which we've just read
    }
}

if( fileToWatch ) {
    main(fileToWatch, watchMode, platform);
} else {
    console.log("Usage: npx trowser --file path/to/file.ts [--watch]")
}