const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { config } = require('../../config.json');

module.exports = { 
    async execute(interaction) {
        const aaaaurora__announcements_role = interaction.guild.roles.cache.find(role => role.name === config.roles.announcements.name ?? '\`@AAAAurora_\'s Stream Announcements\`');

        const row_1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(`AAAAurora's_ Stream Announcements`)
                    .setCustomId(`stream:aaaaurora_`)
                    .setDisabled(false)
            );

        const embed = {
            title: `Stream Announcements!!`,
            description: `Click the button below to get the ${aaaaurora__announcements_role} to be pinged whenever AAAAurora_ goes live on Twitch\n\nClick the button again to no longer be pinged`,
            color: parseInt(0x9147fe),
            thumbnail: {
                url: config.images.stream_announcements_thmb,
                height: 0,
                width: 0
            }
        }


        const stream_announcements = { embeds: [embed], components: [row_1] }
        return stream_announcements;
    }
}