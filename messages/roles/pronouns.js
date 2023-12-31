const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { config } = require('../../config.json');
const { logger } = require("../../utils/logger");

module.exports = { 
    async execute(interaction) {
        const row_1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(`She/Her`)
                    .setCustomId(`role:pronouns:she_her`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`She/They`)
                    .setCustomId(`role:pronouns:she_they`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`She/He`)
                    .setCustomId(`role:pronouns:she_he`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`She/He/They`)
                    .setCustomId(`role:pronouns:she_he_they`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`She/They/He`)
                    .setCustomId(`role:pronouns:she_they_he`)
                    .setDisabled(false)
            );

        const row_2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(`He/Him`)
                    .setCustomId(`role:pronouns:he_him`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`He/They`)
                    .setCustomId(`role:pronouns:he_they`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`He/She`)
                    .setCustomId(`role:pronouns:he_she`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`He/She/They`)
                    .setCustomId(`role:pronouns:he_she_they`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`He/They/She`)
                    .setCustomId(`role:pronouns:he_they_she`)
                    .setDisabled(false)
            );

        const row_3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(`They/Them`)
                    .setCustomId(`role:pronouns:they_them`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`They/She`)
                    .setCustomId(`role:pronouns:they_she`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`They/He`)
                    .setCustomId(`role:pronouns:they_he`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`They/She/He`)
                    .setCustomId(`role:pronouns:they_she_he`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`They/He/She`)
                    .setCustomId(`role:pronouns:they_he_she`)
                    .setDisabled(false)
            );

        const row_4 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel(`Any Pronouns`)
                    .setCustomId(`role:pronouns:any`)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(`Neopronouns`)
                    .setCustomId(`role:pronouns:neo`)
                    .setDisabled(false)
            );

        const embed = {
            title: `Pronoun Roles`,
            description: `Click the buttons to set your pronouns! \nClicking a button again will remove those pronouns, you may do this as much as you like\n\nIf you use multiple pronouns but have no preference, select the blue options. If you use multiple pronouns and DO have a preference, choose from the gray options.\n\n**Example:** If I use all pronouns but prefer she and they equally. I would choose she/he and they/he, showing that he is my secondary choice. If you prefer your pronouns in a certain order, pick the right option for you!`,
            color: parseInt(config.colors.rainbow[0].hex),
            thumbnail: {
            url: config.images.pronouns_thmb,
            height: 0,
            width: 0
            }
        }

        const pronouns = { embeds: [embed], components: [row_1, row_2, row_3, row_4] }
        logger.debug(`created pronouns message`);
        return pronouns;
    }
}