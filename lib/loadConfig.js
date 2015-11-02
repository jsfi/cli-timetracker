/*
 * cli-timetracker
 * https://github.com/jsfi/cli-timetracker
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('lodash');

const userConfig = require('../config/user');
const defaultConfig = require('../config/default');

module.exports = _.defaultsDeep({}, userConfig, defaultConfig);
