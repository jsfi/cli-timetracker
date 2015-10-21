/*
 * timetracker
 * https://github.com/jsfi/timetracker
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const util = require('util');
const moment = require('moment');

module.exports = function(config) {
    return function(tasks) {
        let output = false;

        tasks.forEach(function(dayTasks) {
            if (!dayTasks.length) {
                return;
            }

            if (output) {
                console.log();
            }

            console.log(dayTasks.date.format(config.i18n.dayFormat));
            dayTasks.forEach(function(task) {
                console.log(util.format(config.i18n.taskFormat, moment(task.time, 'X').format(config.i18n.taskTimeFormat), task.task));
            });

            output = true;
        });

        if (!output) {
            console.log(config.i18n.noTasksInPeriod);
        }

        return tasks;
    };
};
