const fs = require('fs');
const { logger } = require('./logger');

module.exports = { clockIn, clockOut, clockView }

function clockIn(id) {
    let clockData = getClock();
    
    const worker = getWorker(clockData, id);
    if (worker.clocked_in === -1) {
        worker.clocked_in = new Date();
        saveWorker(clockData, worker);
        saveClock(clockData);
        return true;
    }
    return false;
}

/**
 * 
 * @param {int} id 
 * @returns {{sessionTime: int, totalTime: int}}
 */
function clockOut(id) {
    let clockData = getClock();

    const worker = getWorker(clockData, id);
    if (worker.clocked_in === -1) {
        return {sessionTime: -1, totalTime: -1};
    }
    const sessionTime = new Date() - new Date(worker.clocked_in);
    const totalTime = worker.time + sessionTime;
    worker.time = totalTime;
    worker.clocked_in = -1;
    saveWorker(clockData, worker);
    saveClock(clockData);
    return {sessionTime: sessionTime, totalTime: totalTime};
}

/**
 * 
 * @param {int} id 
 * @returns {{currentTime: int, sessionTime: int, totalTime: int}}
 */
function clockView(id) {
    let clockData = getClock();

    const worker = getWorker(clockData, id);
    if (worker.clocked_in === -1) {
        return { currentTime: worker.time, sessionTime: 0, totalTime: worker.time };
    }
    const sessionTime = new Date() - new Date(worker.clocked_in);
    const totalTime = worker.time + sessionTime;
    return { currentTime: worker.time, sessionTime: sessionTime, totalTime: totalTime }
}

function getWorker(clockData, id) {
    length = clockData["workers"].length;
    for (let i = 0; i < length; i++) {
        if (clockData.workers[i].id === id) {
            return clockData["workers"][i];
        }
    }

    addWorker(clockData, id);
    return clockData["workers"][length];
}

function saveWorker(clockData, workerData) {
    const id = workerData.id;
    for (let i = 0; i < clockData.workers.length; i++) {
        if (clockData["workers"][i].id === id) {
            clockData["workers"][i] = workerData;
            return;
        }
    }
    throw ReferenceError(`No worker found in worker data with id ${id}`);
}

function addWorker(clockData, id) {
    clockData["workers"].push({
        id: id,
        time: 0,
        clocked_in: -1
    });
    
}

/**
 * 
 * @returns {JSON}
 */
function getClock() {
    let clock;
    try {
        clock = JSON.parse(fs.readFileSync(`${__dirname}/../data/timeclock.json`));
    } catch (error) {
        logger.error(`error while reading time clock data (${error})`);
    }

    if (!clock) {
        logger.debug('time clock data not found... creating it');
        return {"workers": []}
    }
    return clock;
}

function saveClock(clockData) {
    if (!clockData) { return; }

    fs.writeFileSync(`${__dirname}/../data/timeclock.json`, JSON.stringify(clockData));
}