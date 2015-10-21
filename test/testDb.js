/*
 * timetracker
 * https://github.com/jsfi/timetracker
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('lodash');

let data = {};

module.exports = {
    put: put,
    get: get,
    del: del,
    reset: reset
};

function put(key, value) {
    return new Promise(function(resolve) {
        if (!_.isString(value)) {
            value = JSON.stringify(value);
        }

        resolve(data[key] = value);
    });
}

function get(key) {
    return new Promise(function(resolve) {
        try {
            resolve(JSON.parse(data[key]));
        } catch(err) {
            resolve(data[key]);
        }
    });
}

function del(key) {
    return new Promise(function(resolve) {
        resolve(delete data[key]);
    });
}

function reset() {
    data = {};
}
