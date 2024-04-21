#!/usr/bin/env node
"use strict";

import main from './setupTest';




let watchMode = false;
let fileToWatch = '';
let external:string[] = [];

for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--watch') {
        watchMode = true;
    } else if (process.argv[i] === '--file' && i + 1 < process.argv.length) {
        // Assumes that the `--file` option is always followed by the filename
        fileToWatch = process.argv[i + 1];
        i++;  // Skip the next element, which we've just read
    } else if (process.argv[i] === '--external' && i + 1 < process.argv.length) {
        const json = process.argv[i + 1];
        console.log("Extenral json: "+json);
        const raw = JSON.parse(json);
        if( !Array.isArray(raw) || !raw.every(x => typeof x==='string') ) throw new Error(`Externalise needs a list of package names as a json string array, e.g. "[\"fs\"]"`)
        external = [...external, ...raw];
        console.log("Set external: ", external);
        i++;  // Skip the next element, which we've just read
    } else if (process.argv[i] === '--externalise-pg-mem') {
        
        external = [...external, 'path', 'fs', 'os', 'net', 'tls', 'crypto', 'stream', 'perf_hooks', 'typeorm', 'slonik', 'pg-promise', 'knex', 'kysely', '@mikro-orm/core', '@mikro-orm/postgresql', "module", "url", "events", "util", "dns", "string_decoder"]
    }
}

if( fileToWatch ) {
    main(fileToWatch, external, watchMode);
} else {
    console.log("Usage: npx trowser --file path/to/file.ts [--watch]")
}