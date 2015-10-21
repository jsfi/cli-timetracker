/*
 * timetracker
 * https://github.com/jsfi/timetracker
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('lodash');

module.exports = function(args, tasks, config) {
    let views = [];

    for (let prop in args) {
        if (_.startsWith(prop, 'view-') && args[prop]) {
            try {
                let view = prop.replace('view-', '');
                require.resolve('../view/' + view);
                views.push(view);
            } catch(e) {
                console.log(e); // eslint-disable-line no-console
            }
        }
    }

    if (args.move) {
        return tasks.move(args.date, args.date.unix(), args.move.unix())
        .then(result => console.log(config.i18n[result ? 'taskMoved' : 'taskNotFound'])); // eslint-disable-line no-console
    }

    if (args.delete) {
        return tasks.del(args.date, args.date.unix())
        .then(result => console.log(config.i18n[result ? 'taskRemoved' : 'taskNotFound'])); // eslint-disable-line no-console
    }

    if (views.length) {
        let renderViews = getViewData();

        if (!renderViews) {
            return false;
        }

        views.forEach(function(view) {
            renderViews.then(require('../view/' + view)(config));
        });

        return renderViews;
    }

    return tasks.add(args.date, {
        time: args.date.unix(),
        task: args.task.join(' '),
        state: 0
    }).then(result => {
        if (result) {
            console.log(config.i18n.taskAdded); // eslint-disable-line no-console
        }
    });

    function getViewData() {
        let days = [];
        let from = args.from.clone();

        if (from.isAfter(args.to)) {
            console.log(config.i18n.timePeriodError); // eslint-disable-line no-console
            return false;
        }

        while (!from.isAfter(args.to)) {
            days.push(tasks.get(from.clone()));
            from = from.add(1, 'd');
        }

        return Promise.all(days);
    }
};
