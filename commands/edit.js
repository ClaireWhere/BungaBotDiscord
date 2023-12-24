const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord.js');
const rules = require('../messages/rules.js');
const discord_announcements = require('../messages/roles/discord_announcements.js');
const stream_announcements = require('../messages/roles/stream_announcements.js')
const pronouns = require('../messages/roles/pronouns.js')
const { logger } = require('../utils/logger.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('edit')
		.setDescription('Edits important server messages')
		.setDefaultMemberPermissions(0)
		.setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName('roles')
            .setDescription('Edits the specified message to be the specified updated reaction roles message')
            .addStringOption(option =>
                option.setName('type')
                .setDescription('The specific roles message to edit')
                .setRequired(true)
                .addChoices(
                    {name: 'Pronouns', value: 'pronouns'},
                    {name: 'Discord Announcements', value: 'discord_announcements'},
                    {name: 'Stream Announcements', value: 'stream_announcements'},
                ))
            .addChannelOption(option =>
                option.setName('channel')
                .setDescription('The channel to search for the message in')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
            .addStringOption(option =>
                option.setName('message_id')
                .setDescription('The id/snowflake of the message to edit')
                .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('rules')
            .setDescription('Edits the specified message to be the updated rules message')
            .addChannelOption(option =>
                option.setName('channel')
                .setDescription('The channel to search for the message in')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
            .addStringOption(option =>
                option.setName('message_id')
                .setDescription('The id/snowflake of the message to edit')
                .setRequired(true))
        ),
    /**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     * @returns 
     */
	async execute(interaction) {
        if (interaction.commandName != 'edit') { return; }

        const channel = interaction.client.channels.cache.get(interaction.options.get('channel').value);

        const message_id = interaction.options.get('message_id').value;

        const message = await channel.messages.fetch({cache: false, around: message_id, limit: 1})
            .then((m) => { 
                logger.info(`found message with id ${message_id} for /${interaction.commandName} interaction`);
                return m.first();
            }).catch(async (error) => {
                logger.warn(`message with id ${message_id} not found in the channel ${channel} for /${interaction.commandName} interaction (${error})`);
                await interaction.editReply({content: `⚠️ Error: A message with the specified id \`${message_id}\` was not able to be found in the channel ${channel}`})
                    .catch((error) => {logger.error(error)});
            });

        if (!message) { return; }

        const output = await getOutput(interaction).catch(async (error) => {
            return;
        });
        if (!output) {
            await interaction.editReply({content: `⚠️ Error: either an invalid subcommand was specified or the contents for the message could not be found`})
                .catch((error) => {logger.error(error)});
            return;
        }

        return await message.edit(output)
            .then(async (res) => {
                logger.info(`${interaction.options.getSubcommand()} message successfully edited`);
        
		        await interaction.editReply({content: `The \`${interaction.options.getSubcommand()}\` message in ${channel} has been successfully updated!`, ephemeral: true})
                    .catch((error) => {logger.error(error)});
                return true;
            }).catch(async (error) => {
                logger.warn(`unable to edit ${interaction.options.getSubcommand()} message (${error})`);

                await interaction.editReply({content: `⚠️ Error: The message with id \`${message_id}\` was not able to be edited. Double check the original message was sent by this bot and try again.`})
                    .catch((error) => {logger.error(error)});
                return false;
            });
	},
};

/**
 * 
 * @param {import('discord.js').CommandInteraction} interaction 
 * @returns 
 */
function getOutput(interaction) {
    const subcommand = interaction.options.getSubcommand(false);
    if (!subcommand) { return null; }

    return subcommand === 'roles' ? getRoleOutput(interaction)
         : subcommand === 'rules' ? rules.execute(interaction)
         : null;
}

/**
 * 
 * @param {import('discord.js').CommandInteraction} interaction 
 * @returns 
 */
function getRoleOutput(interaction) {
    const type = interaction.options.get('type').value;
    console.log(`type: ${type}`);
    return type === 'stream_announcements' ? stream_announcements.execute(interaction)
         : type === 'discord_announcements' ? discord_announcements.execute(interaction)
         : type === 'pronouns' ? pronouns.execute(interaction)
         : null;
}