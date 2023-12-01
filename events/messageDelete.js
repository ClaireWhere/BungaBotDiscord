const { config } = require('../config.json');
const { messageToBuffer } = require('../utils/messageToImage');
const { AttachmentBuilder, Events } = require('discord.js');
const { logger } = require('../../utils/logger');

module.exports = {
    name: Events.MessageDelete,
    /**
     * 
     * @param {import('discord.js').Interaction} message 
     * @returns 
     */
    async execute(message) {
        if (!config.deleted_message_log.enabled) { return; }
        logger.info(`received ${this.name.toString()} interaction from channel: ${message.channel} by ${message.author.username}`);

        const author = message.guild.members.cache.find(user => user.id === message.author.id);
        const nickname = author.nickname ?? message.author.globalName ?? message.author.username;
        const displayColor = author.displayHexColor;
        
        const buffer = await messageToBuffer(message, nickname, displayColor);
        const file = !buffer ? null : new AttachmentBuilder().setFile(buffer).setName('message.png');
        const creation_date = new Date(message.createdTimestamp);

        const embed = {
            title: "**MESSAGE DELETED**",
            description: '' 
                + `**Author: **${message.author.globalName} (${message.author.username})`
                + `\n**Channel: **${message.channel}`
                + `\nCreated On: ${creation_date.toLocaleDateString()} ${creation_date.toLocaleTimeString()}`,
            timestamp: new Date().toISOString(),
            footer: {
                text: `Message ID: ${message.id}\nAuthor ID: ${message.author.id}`,
                icon_url: message.author.avatarURL()
            },
            // thumbnail: {
            //     url: message.author.avatarURL()
            // },
            author: {
                name: message.author.globalName,
                icon_url: message.author.avatarURL()
            },
            image: {
                url: 'attachment://message.png'
            },
            color: parseInt(config.colors.light_red.darken[2].hex)
        }

        
        let delchannel = message.guild.systemChannel;
        // let delchannel = await message.guild.channels.cache.find(x => x.name === 'moderator-only');
        if (!file) {
            await delchannel.send({embeds: [embed]});
        } else {
            await delchannel.send({embeds: [embed], files: [file]});
        }
    }
}