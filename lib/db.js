/*
 * timetracker
 * https://github.com/jsfi/timetracker
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const level = require('level');
const _ = require('lodash');
const promisify = require('es6-promisify');

let ret = [];

module.exports = function(config) {
    if (!ret[config.dir]) {
        ret[config.dir] = init(config);
    }

    return ret[config.dir];
};

function init(config) {
    let db = level(config.dir);

    let levelPut = promisify(db.put.bind(db));
    let levelGet = promisify(db.get.bind(db));
    let levelDel = promisify(db.del.bind(db));

    return {
        put: put,
        get: get,
        del: levelDel
    };

    function put(key, value) {
        if (!_.isString(value)) {
            value = JSON.stringify(value);
        }

        return levelPut(key, value);
    }

    function get(key) {
        return levelGet(key)
            .then(value => {
                try {
                    return JSON.parse(value);
                } catch(err) {
                    return value;
                }
            }).catch(err => {
                if (err.name !== 'NotFoundError') {
                    throw err;
                }

                return undefined;
            });
    }
}
