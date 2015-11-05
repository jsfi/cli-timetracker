/*
 * cli-timetracker
 * https://github.com/jsfi/cli-timetracker
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const util = require('util');
const _ = require('lodash');

module.exports = function(args, tasks, config, output) {
    let views = [];

    for (let prop in args) {
        if (_.startsWith(prop, 'view-') && args[prop]) {
            try {
                let view = prop.replace('view-', '');
                require.resolve('../view/' + view);
                views.push(view);
            } catch(e) {
                output(e);
            }
        }
    }

    if (args.move) {
        return tasks.move(args.date, args.date.unix(), args.move.unix())
        .then(result => output(config.i18n[result ? 'taskMoved' : 'taskNotFound']));
    }

    if (args.delete) {
        return tasks.del(args.date, args.date.unix())
        .then(result => output(config.i18n[result ? 'taskRemoved' : 'taskNotFound']));
    }

    if (views.length) {
        let renderViews = getViewData();

        if (!renderViews) {
            return false;
        }

        views.forEach(function(view) {
            renderViews.then(require('../view/' + view)(config, output));
        });

        return renderViews;
    }

    return tasks.add(args.date, {
        time: args.date.unix(),
        task: args.task.join(' '),
        state: 0
    }).then(result => {
        if (result) {
            output(util.format(config.i18n.taskAdded, args.date.format(config.i18n.taskTimeFormat), args.task.join(' ')));
        }
    });

    function getViewData() {
        let days = [];
        let from = args.from.clone();

        if (from.isAfter(args.to)) {
            output(config.i18n.timePeriodError);
            return false;
        }

        while (!from.isAfter(args.to)) {
            days.push(tasks.get(from.clone()));
            from = from.add(1, 'd');
        }

        return Promise.all(days);
    }
};
