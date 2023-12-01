const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { config } = require('../config.json');
const { getChannelParentName } = require('../utils/utils');
require('dotenv').config();

module.exports = {
    async execute(interaction) {
        const embed_1 = new EmbedBuilder()
            .setTitle(`‎\n📣 Follow the rules or you will get Bunga Blasted™`)
            .setDescription('‎\n')
            .setColor(parseInt(0xb10202))
            .setAuthor({ name: 'Bunga Bot', iconURL: config.images.bunga_bot_icon })
            .setThumbnail(config.images.rules_thmb);

        const art_channel_name = config.channels.art_channel_name;
        const spam_channel_name = config.channels.spam_channel_name;
        const nsfw_channel_name = config.channels.nsfw_channel_name;
        const wall_of_shame_channel_name = config.channels.wall_of_shame_channel_name;
        const hall_of_fame_channel_name = config.channels.hall_of_fame_channel_name;
        const notExists = true;
        const art = notExists ? `\`#${art_channel_name}\`` : await interaction.guild.channels.cache.find(channel => channel.name === art_channel_name && !getChannelParentName(channel).includes('archive')) ?? `\`#${art_channel_name}\``;
        const spam = notExists ? `\`#${spam_channel_name}\`` : await interaction.guild.channels.cache.find(channel => channel.name === spam_channel_name && !getChannelParentName(channel).includes('archive')) ?? `\`#${spam_channel_name}\``;
        const nsfw = notExists ? `\`#${nsfw_channel_name}\`` : await interaction.guild.channels.cache.find(channel => channel.name === nsfw_channel_name && !getChannelParentName(channel).includes('archive')) ?? `\`#${nsfw_channel_name}\``;
        const wall_of_shame = notExists ? `\`#${wall_of_shame_channel_name}\`` : await interaction.guild.channels.cache.find(channel => channel.name === wall_of_shame_channel_name && !getChannelParentName(channel).includes('archive')) ?? `\`#${wall_of_shame_channel_name}\``;
        const hall_of_fame = notExists ? `\`#${hall_of_fame_channel_name}\`` : await interaction.guild.channels.cache.find(channel => channel.name === hall_of_fame_channel_name && !getChannelParentName(channel).includes('archive')) ?? `\`#${hall_of_fame_channel_name}\``;
        
        const embed_2 = new EmbedBuilder()
            .setColor(parseInt(0x00FFA3))
            .addFields(
                {
                    "name": `\u200B`,
                    "value": `1️⃣ Don't be racist/homophobic/transphobic/bigoted or you will be banned. Any type of hate speech is not tolerated. Do not post anyone's personal information such as location without their permission.`
                },
                {
                    "name": `\u200B`,
                    "value": `2️⃣ Use channels as intended (i.e. talking about art should be in ${art})`
                },
                {
                    "name": "\u200B",
                    "value": `3️⃣ Keep excessive texting/spam to <#${spam}>`
                },
                {
                    "name": "\u200B",
                    "value": `4️⃣ Keep NSFW topics or memes to <#${nsfw}>`
                },
                {
                    "name": "\u200B",
                    "value": `>>> Please do not flirt or be blatantly nsfw in channels that aren't <#${nsfw}>`,
                    "inline": true
                },
                {
                    "name": "\u200B",
                    "value": `>>> Do NOT sext on the server`,
                    "inline": true
                },
                {
                    "name": "\u200B",
                    "value": `5️⃣ All events will be held in event-specific channels, and overseen by our event mods.`
                },
                {
                    "name": "\u200B",
                    "value": `6️⃣ All rule-breakers shall have screenshot posted <#${wall_of_shame}>`,
                    "inline": true
                },
                {
                    "name": "\u200B",
                    "value": `7️⃣ All EPIC GAMERS shall have screenshots posted in <#${hall_of_fame}>`,
                    "inline": true
                },
                
                {
                    "name": "\u200B",
                    "value": `8️⃣ All mods have general permission to delete messages as they see fit.`
                },
                {
                    "name": "\u200B",
                    "value": `9️⃣ Please do not spam ping mods.`
                },
                {
                    "name": "\u200B",
                    "value": `🔟 Rules are subject to change as <@${aurora}> and the Mod Team see fit.\n\n\nFrog Abuse Will Not Be Tolerated.`
                }
                
            )
            .setTimestamp()
            .setFooter({ text: `Posted on`, iconURL: config.images.bunga_bot_icon });

        const rules = { embeds: [embed_1, embed_2] };
        return rules;
    }
}