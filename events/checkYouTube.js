const rss_parser = require('rss-parser');
const parser = new rss_parser();
const { config } = require('../config.json');
const cron = require('cron');
const { logger } = require('../utils/logger');
const fs = require('fs');
const { EmbedBuilder } = require('@discordjs/builders');
require('dotenv').config();

let scheduledCheck;
let client;

async function checkYouTube() {
    if (client === undefined) {
        logger.error(`Stopping run of checkYouTube\n\tclient was not initialized: ${Object.prototype.toString.call(client)}`)
        return;
    }

    const yt_channels = config.youtube.channels;
    logger.debug(`checking ${yt_channels.length} youtube channels for new videos`);

    for (let yt_channel of yt_channels) {
        const yt_channel_id = yt_channel.yt_channel_id;
        const discord_channel_id = yt_channel.discord_channel_id;
        const yt_channel_icon = yt_channel.channel_icon;

        // retrieve youtube rss feed
        const yt_data = await parser.parseURL(
            `https://youtube.com/feeds/videos.xml?channel_id=${yt_channel_id}`
        ).catch(error => {
            logger.error(`error while parsing youtube rss feed for ${yt_channel_id} (${error})`);
        });

        // check if youtube channel has any data/exists
        if (!yt_data) { 
            logger.warn(`no data found for youtube channel ${yt_channel_id}`);
            continue; 
        }
        logger.debug(`found ${yt_data.items.length} videos for youtube channel "${yt_data.title}" (${yt_channel_id})`);

        // retrieve latest video
        const latest_video = yt_data.items[0];
        logger.debug(`latest video for youtube channel "${yt_data.title}" (${yt_channel_id}): ${latest_video.title} (${latest_video.link})`);

        // retrieve youtube data from JSON file
        const yt_json_data = getJSONData(yt_channel_id);

        // check if video already exists in youtube data JSON file
        if (videoExists(yt_json_data, yt_data, yt_channel_id)) {
            continue;
        }

        // send announcement to youtube announcements channel
        if (await sendAnnouncement(yt_data, latest_video, discord_channel_id, yt_channel_icon)) {
            // add video to youtube data JSON file
            addVideo(yt_json_data, latest_video, yt_channel_id);
        }

    }
    logger.debug(`next run of youtube checker: ${scheduledCheck.nextDate()}`)

    /** 
     * =============================
     *           Functions
     * =============================
     */

    /**
     * 
     * @param {{[key: string]: any;} & rss_parser.Output<{[key: string]: any;}>} yt_data 
     * @param {{[key: string]: any;} & rss_parser.Item} latest_video 
     * @param {string} discord_channel_id 
     * @param {string} yt_channel_icon 
     * @returns 
     */
    async function sendAnnouncement(yt_data, latest_video, discord_channel_id, yt_channel_icon) {
        if (!config.channels.hasOwnProperty(discord_channel_id)) {
            logger.debug(`announcements channel with id ${discord_channel_id} not found in config.json, skipping announcement`)
            return false;
        }

        const channel = client.channels.cache.find(channel => channel.name === config.channels[discord_channel_id] && channel.guildId === process.env.GUILD_ID);
        
        if (!channel) {
            logger.debug(`youtube announcements channel not found, skipping announcement`)
            return false;
        }

        const message = getYouTubeAnnouncement(latest_video, yt_data.title, yt_channel_icon);
        return await channel.send(message)
            .catch(error => {
                logger.error(`error while sending youtube announcement embed to #${channel.name} channel (${error})`);
                return false;
            }).then(() => {
                logger.debug(`sent youtube announcement embed to #${channel.name} channel\n\t${message}`);
                return true;
            });
    }

    /**
     * @param {{[key: string]: any;} & rss_parser.Item} latest_video 
     * @param {string} channel_name 
     * @param {string} channel_icon 
     * @returns 
     */
    function getYouTubeAnnouncement(latest_video, channel_name, channel_icon) {
        const title = `**${latest_video.title}**`;
        const description = `New video from ${channel_name}!\nCome check it out!!`;
        const video_id = latest_video.id.split(':');
        const thumbnail = `http://img.youtube.com/vi/${video_id.pop()}/0.jpg`;
        const footer = { text: `Published `, iconURL: channel_icon };
        const timestamp = new Date(latest_video.pubDate);
        const color = parseInt(0xd6b2e0);
        const author = { name: channel_name, iconURL: channel_icon };
        
        logger.debug(`CREATING YOUTUBE ANNOUNCEMENT`);
        logger.debug(`\ttitle: ${title}`);
        logger.debug(`\tdescription: ${description}`);
        logger.debug(`\tthumbnail: ${thumbnail}`);
        logger.debug(`\turl: ${latest_video.link}`);
        logger.debug(`\tfooter: ${footer}`);
        logger.debug(`\ttimestamp: ${timestamp}`);
        logger.debug(`\tcolor: ${color}`);
        logger.debug(`\tauthor: ${author}`);

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setImage(thumbnail)
            .setURL(latest_video.link)
            .setFooter(footer)
            .setTimestamp(timestamp)
            .setColor(color)
            .setAuthor(author);
        const message = { embeds: [embed]};
        return message;
    }

    /**
     * 
     * @param {{any: {videos: string[];};}[]} yt_json_data 
     * @param {{[key: string]: any;} & rss_parser.Item} latest_video 
     * @param {string} yt_channel_id 
     */
    function addVideo(yt_json_data, latest_video, yt_channel_id) {
        yt_json_data[yt_channel_id]["videos"].push(latest_video.id);
        if (!fs.existsSync(`${__dirname}/../data`)) {
            logger.debug(`youtube data directory not found, creating it`);
            fs.mkdirSync(`${__dirname}/../data`);
        }
        fs.writeFileSync(`${__dirname}/../data/youtube.json`, JSON.stringify(yt_json_data), (error) => {
            if (error) {
                logger.error(`error while writing youtube data to file (${error})`);
            }
        });
        logger.info(`saved video ${latest_video.title} (${latest_video.link}) to youtube data`);
    }

    /**
     * 
     * @param {{any: {videos: string[];};}[]} yt_json_data 
     * @param {{[key: string]: any;} & rss_parser.Output<{[key: string]: any;}>} yt_data 
     * @param {string} yt_channel_id 
     * @returns 
     */
    function videoExists(yt_json_data, yt_data, yt_channel_id) {
        const latest_video = yt_data.items[0];
        if (yt_json_data[yt_channel_id]["videos"].includes(latest_video.id)) {
            logger.debug(`latest video for youtube channel "${yt_data.title}" (${yt_channel_id}) is already in youtube data, skipping`);
            return true;
        }
        logger.info(`new video found for youtube channel ${yt_channel_id}: ${latest_video.title} (${latest_video.link})`);
        return false;
    }
    
    /**
     * 
     * @param {string} yt_channel_id 
     * @returns {{any: {videos: string[];};}[]}
     */
    function getJSONData(yt_channel_id) {
        let yt_json_data;
        try {
            yt_json_data = JSON.parse(fs.readFileSync(`${__dirname}/../data/youtube.json`));
        } catch (error) {
            logger.error(`error while reading youtube data from file (${error})`);
        }
        logger.debug(`youtube data: ${JSON.stringify(yt_json_data)}`);
        
        if (!yt_json_data) {
            logger.info(`youtube data not found, creating it`);
            yt_json_data = {yt_channel_id: {"videos": []}};
        }

        // Ensure channel id exists in YouTube data JSON file
        if (!yt_json_data.hasOwnProperty(yt_channel_id)) {
            logger.debug(`youtube channel ${yt_channel_id} not found in youtube data, adding it`);
            yt_json_data[yt_channel_id] = {"videos": []};
            logger.debug(`\n\t${JSON.stringify(yt_json_data[yt_channel_id], null, "\t")}`);
        }
        return yt_json_data;
    }
}

/**
 * 
 * @param {import('discord.js/typings').Client} client_ 
 */
function start(client_) {
    logger.info(`scheduling youtube checker for every ${config.youtube.interval_mins} minutes`);
    client = client_;
    scheduledCheck = new cron.CronJob(`00 */${config.youtube.interval_mins} * * * *`, checkYouTube);
    scheduledCheck.start();
    logger.debug(`started youtube checker: ${scheduledCheck.running}`);
    logger.debug(`youtube checker next run: ${scheduledCheck.nextDate()}`);
    checkYouTube();
}

function stop() {
    if (scheduledCheck) {
        scheduledCheck.stop();
        client = undefined;
    }
}

module.exports = {
    name: 'ready',
    once: true,
    execute: async (client) => {
        start(client);
    },
    stop: () => {
        stop();
    },
    checkYouTube
}