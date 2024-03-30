#!/usr/bin/env node
"use strict";

import main from './setupTest';




let watchMode = false;
let fileToWatch = '';

for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--watch') {
        watchMode = true;
    } else if (process.argv[i] === '--file' && i + 1 < process.argv.length) {
        // Assumes that the `--file` option is always followed by the filename
        fileToWatch = process.argv[i + 1];
        i++;  // Skip the next element, which we've just read
    }
}

if( fileToWatch ) {
    main(fileToWatch, watchMode);
} else {
    console.log("Usage: npx trowser --file path/to/file.ts [--watch]")
}