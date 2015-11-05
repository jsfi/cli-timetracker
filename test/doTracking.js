/*
 * timetracker
 * https://github.com/jsfi/timetracker
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(config, output, args) {
    return require('../lib/controller.js')(
        require('../lib/args.js')(config.args, args),
        require('../lib/tasks')(config, require('./testDb')),
        config,
        output
    );
};
