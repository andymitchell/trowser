#!/usr/bin/env node
"use strict";

import main from './setupTest';

main(process.argv[2]).catch((err: Error) => console.error(err));