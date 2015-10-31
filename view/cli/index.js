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
        let emptyLine = false;

        tasks.forEach(function(dayTasks) {
            if (!dayTasks.length) {
                return;
            }

            if (emptyLine) {
                console.log(); // eslint-disable-line no-console
            }

            console.log(dayTasks.date.format(config.i18n.dayFormat)); // eslint-disable-line no-console
            dayTasks.forEach(function(task) {
                console.log(util.format(config.i18n.taskFormat, moment(task.time, 'X').format(config.i18n.taskTimeFormat), task.task)); // eslint-disable-line no-console
            });

            emptyLine = true;
        });

        if (!emptyLine) {
            console.log(config.i18n.noTasksInPeriod); // eslint-disable-line no-console
        }

        return tasks;
    };
};
