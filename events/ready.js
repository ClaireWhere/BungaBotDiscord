const { Client } = require("discord.js");
const { logger } = require("../utils/logger");
const { clockIn, clockOut } = require("../utils/timeclock.utils");
const { dateToString } = require("../utils/utils");

module.exports = {
    name: 'ready',
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    execute(client) {
        logger.info(`Ready! Logged in as ${client.user.tag}`);
        const time = clockOut(client.user.id);
        logger.info(`Clocked out ${client.user.tag} after ${dateToString(time.sessionTime)}. Total time on the clock: ${dateToString(time.totalTime)}`);
        clockIn(client.user.id);
        logger.info(`Clocked in ${client.user.tag}`);
    },
};