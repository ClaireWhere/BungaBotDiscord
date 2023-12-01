const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord.js');
const rules = require('../messages/rules.js');
const roles = require('../messages/roles.js');
const { logger } = require('../utils/logger.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send')
		.setDescription('Sends important server stuff')
		.setDefaultMemberPermissions(0)
		.setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName('roles')
            .setDescription('Sends the reaction roles in the specified channel')
            .addChannelOption(option =>
                option.setName('channel')
                .setDescription('The channel to send the roles to')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('rules')
            .setDescription('Sends the rules in the specified channel')
            .addChannelOption(option =>
                option.setName('channel')
                .setDescription('The channel to send the rules to')
                .setRequired(true)
            )
        ),
	async execute(interaction) {
        if (interaction.commandName != 'send') { return; }

        const channel = interaction.client.channels.cache.get(interaction.options.get('channel').value);

        var output = await getOutput(interaction, channel).catch((error) => {
            logger.warn(`error in retrieving output for ${interaction.commandName} ${interaction.options.getSubcommand()} interaction (${error})`);
        });

        if (!output) {
            await interaction.editReply({content: `Error: invalid subcommand specified`})
                .catch((error) => {logger.error(`invalid subcommand specified (${error})`)});
            return;
        }

        // convert output to an array if it isn't already (due to inconsistencies in the output sometimes needing to be an array for multiple messages and not otherwise)
        if (!output.length) {
            output = [output];
        }

        for (let i = 0; i < output.length; i++) {
            await channel.send(output[i])
                .then((res) => {
                    logger.info(`Successfully sent message ${i+1} of ${output.length} for ${interaction.options.getSubcommand()}`);
                }).catch((error) => {
                    logger.warn(`There was an error sending message ${i+1} of ${output.length} for ${interaction.options.getSubcommand()} (${error})`);
                });
        }
        
		return await interaction.editReply({content: `${interaction.options.getSubcommand()} message successfully sent to ${channel}`, ephemeral: true})
        .then(res => {
            return true;
        }).catch((error) => {
            logger.warn(`could not respond to ${interaction.commandName} interaction (${error})`);
            return false;
        });
	},
};

/**
 * 
 * @param {import('discord.js').CommandInteraction} interaction 
 * @returns 
 */
function getOutput(interaction, channel) {
    const subcommand = interaction.options.getSubcommand(false);
    if (!subcommand) { return null; }

    return subcommand === 'roles' ? roles.execute(interaction)
         : subcommand === 'rules' ? rules.execute(interaction)
         : null;
}