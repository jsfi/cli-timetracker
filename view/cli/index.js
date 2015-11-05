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

module.exports = function(config, output) {
    return function(tasks) {
        let emptyLine = false;

        tasks.forEach(function(dayTasks) {
            if (!dayTasks.length) {
                return;
            }

            if (emptyLine) {
                output();
            }

            output(dayTasks.date.format(config.i18n.dayFormat));
            dayTasks.forEach(function(task) {
                output(util.format(config.i18n.taskFormat, moment(task.time, 'X').format(config.i18n.taskTimeFormat), task.task));
            });

            emptyLine = true;
        });

        if (!emptyLine) {
            output(config.i18n.noTasksInPeriod);
        }

        return tasks;
    };
};
