#! /usr/bin/env node
/*
 * cli-timetracker
 * https://github.com/jsfi/cli-timetracker
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const config = require('./lib/loadConfig');

require('./lib/controller.js')(
    require('./lib/args.js')(config.args),
    require('./lib/tasks')(config, require('./lib/db')(config.db)),
    config,
    require('./lib/output')
);
