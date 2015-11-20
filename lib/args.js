/*
 * cli-timetracker
 * https://github.com/jsfi/cli-timetracker
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const moment = require('moment');

//second parameter for testing
module.exports = function(configuration, args) {
    let date = moment();

    args = require('parse-cli-arguments')(configuration, args);

    //work always with zero seconds for del, move
    date.seconds(0);

    if (args.at) {
        date = parseDateInput(date, args.at);
    }

    if (args.diff) {
        let diff = parseInt(args.diff);
        date = date.add(diff, 'm');
    }

    if (args.move) {
        args.move = parseDateInput(date, args.move);
    }

    args.date = date.clone();

    if (args.from) {
        args.from = parseDateInput(date, args.from, true);
    } else {
        args.from = date.clone();
    }

    if (args.to) {
        args.to = parseDateInput(date, args.to, true);
    } else {
        args.to = date.clone();
    }

    return args;
};

//noTime if only date part is passed
function parseDateInput(date, input, noTime) {
    let offset = noTime ? 2 : 0;
    let parts = input.split(/\D+/);
    date = date.clone();

    while (parts.length) {
        let val = parseInt(parts.shift());

        if (Number.isNaN(val)) {
            throw new Error(`${input} could not be parsed.`);
        }

        switch (parts.length) {
            case (0 - offset):
                date.minute(val);
                break;
            case (1 - offset):
                date.hour(val);
                break;
            case (2 - offset):
                date.date(val);
                break;
            case (3 - offset):
                date.month(val - 1);
                break;
            case (4 - offset):
                date.year(val);
                break;
        }
    }

    return date;
}
