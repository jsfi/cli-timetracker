'use strict';

const expect = require('expect.js');
const sinon = require('sinon');
const moment = require('moment');

const doTracking = require('../doTracking.js');

/*global describe*/
/*global before*/
/*global after*/
/*global it*/

describe('Diff', function() {
    let config = require('../../config/default');
    let clock;
    let spyConsole;
    let diff = '5';
    let task  = 'test';
    let timestamp;
    let now;

    before(function() {
        timestamp = Math.floor(+(new Date()) / 1000);
        timestamp = (timestamp - (timestamp % 60)) * 1000;

        clock = sinon.useFakeTimers(timestamp);
        spyConsole = sinon.spy(console, 'log');

        now = moment(timestamp, 'x').add(diff, 'm');
    });

    describe('write', function() {
        it('task added', function () {
            spyConsole.reset();

            return doTracking(config, ['-d', diff, task])
            .then(() => {
                expect(spyConsole.calledWith(config.i18n.taskAdded)).to.eql(true);
            });
        });
    });

    describe('read', function() {
        let wait;

        it('read date', function () {
            spyConsole.reset();
            return wait = doTracking(config, ['-p']).then(() => {
                expect(spyConsole.args[0][0]).to.contain(now.format(config.i18n.dayFormat));
            });
        });

         it('read task', function () {
             return wait.then(() => {
                 expect(spyConsole.args[1][0]).to.contain(task);
             });
        });

        it('read time', function () {
            return wait.then(() => {
                expect(spyConsole.args[1][0]).to.contain(now.format(config.i18n.taskTimeFormat));
            });
        });
    });

    after(function() {
        clock.reset();
        console.log.restore(); // eslint-disable-line no-console
        require('../testDb').reset();
    });
});
