'use strict';

const expect = require('expect.js');
const sinon = require('sinon');
const moment = require('moment');

const doTracking = require('../doTracking.js');

/*global describe*/
/*global before*/
/*global after*/
/*global it*/

describe('Moved', function() {
    let config = require('../../config/default');
    let clock;
    let spyOutput;
    let hour = '5';
    let min = '10';
    let task  = 'test';
    let timestamp;
    let now;

    before(function() {
        timestamp = Math.floor(+(new Date()) / 1000);
        timestamp = (timestamp - (timestamp % 60)) * 1000;

        clock = sinon.useFakeTimers(timestamp);
        spyOutput = sinon.spy();

        now = moment(timestamp, 'x').minute(min).hour(hour);
    });

    describe('write', function() {
        it('task added', function () {
            spyOutput.reset();

            return doTracking(config, spyOutput, ['-t', `${hour}:${min}`, task])
            .then(() => {
                expect(spyOutput.calledWithMatch(/added\.$/)).to.eql(true);
            });
        });
    });

    describe('read', function() {
        let wait;

        it('read date', function () {
            spyOutput.reset();
            return wait = doTracking(config, spyOutput, ['-p', '-t', `${hour}:${min}`]).then(() => {
                expect(spyOutput.args[0][0]).to.contain(now.format(config.i18n.dayFormat));
            });
        });

         it('read task', function () {
             return wait.then(() => {
                 expect(spyOutput.args[1][0]).to.contain(task);
             });
        });

        it('read time', function () {
            return wait.then(() => {
                expect(spyOutput.args[1][0]).to.contain(now.format(config.i18n.taskTimeFormat));
            });
        });
    });

    describe('delete', function() {
        it('task moved', function () {
            spyOutput.reset();

            return doTracking(config, spyOutput, ['-t', `${hour}:${min}`, '-D'])
            .then(() => {
                expect(spyOutput.calledWith(config.i18n.taskRemoved)).to.eql(true);
            });
        });
    });

    describe('read moved', function() {
        it('read date', function () {
            spyOutput.reset();
            doTracking(config, spyOutput, ['-p']).then(() => {
                expect(spyOutput.calledWith(config.i18n.noTasksInPeriod)).to.eql(true);
            });
        });
    });

    after(function() {
        clock.reset();
        require('../testDb').reset();
    });
});
