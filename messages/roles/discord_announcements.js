const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { config } = require('../../config.json');

module.exports = { 
    async execute(interaction) {
        const discord_announcements_role = interaction.guild.roles.cache.find(role => role.name === config.roles.announcements.name ?? '\`@Discord Announcements\`');

        const row_1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(`Discord Announcements`)
                    .setCustomId(`discord-announcements`)
                    .setDisabled(false)
            );

        const embed = {
            title: `Discord Announcements!!`,
            description: `Click the button below to get the ${discord_announcements_role} to be pinged whenever this Discord server has new announcements\n\nClick the button again to no longer be pinged`,
            color: parseInt(0x7289da),
            thumbnail: {
                url: config.images.discord_announcements_thmb,
                height: 0,
                width: 0
            }
        }


        const discord_announcements = { embeds: [embed], components: [row_1] }
        return discord_announcements;
    }
}