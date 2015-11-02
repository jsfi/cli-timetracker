/*
 * cli-timetracker
 * https://github.com/jsfi/cli-timetracker
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('lodash');

module.exports = function(config, db) {
    return {
        get: get,
        add: add,
        move: move,
        del: del
    };

    function get(date) {
        return db.get(dbKey(date))
        .then(tasks => {
            if (_.isUndefined(tasks)) {
                tasks = [];
            } else if (!_.isArray(tasks)) {
                throw Error('Invalid Database value: ', tasks);
            }

            tasks.date = date.clone();

            return tasks;
        });
    }

    function add(date, task) {
        return get(date)
        .then(tasks => {
            tasks.splice(_.sortedLastIndex(tasks, task, _.property('time')), 0, task);

            db.put(dbKey(date), tasks);

            return true;
        });
    }

    function move(date, currentTime, newTime) {
        let moved = false;
        return db.get(dbKey(date))
        .then(tasks => {
            tasks = tasks.map(function(task) {
                if (task.time === currentTime) {
                    task.time = newTime;
                    moved = true;
                }

                return task;
            });
            db.put(dbKey(date), tasks);

            return moved;
        });
    }

    function del(date, time) {
        return get(date)
        .then(tasks => {
            let len = tasks.length;

            tasks = _.reject(tasks, _.matchesProperty('time', time));
            db.put(dbKey(date), tasks);

            return len > tasks.length;
        });
    }
};

function dbKey(date) {
    if (_.isString(date)) {
        return date;
    }

    if (date.isValid && date.isValid()) {
        return date.format('YYYY-MM-DD');
    }

    throw new Error('Unexpected database key');
}
