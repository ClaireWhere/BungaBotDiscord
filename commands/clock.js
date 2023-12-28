const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders');
const { config } = require('../config.json');
const { dateToString } = require('../utils/utils');
const { clockView, clockIn, clockOut } = require('../utils/timeclock.utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clock')
		.setDescription('Manage your time spent on the clock for the streamer AAAAurora_')
		.setDefaultMemberPermissions(0)
		.setDMPermission(true)
        .addSubcommand(subcommand =>
            subcommand.setName('in')
            .setDescription('clock in for work 😔')
            .addBooleanOption(option =>
                option.setName('silent')
                .setDescription('sends the clock message silently')
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('out')
            .setDescription('clock out of work and get back to your miserable life')
            .addBooleanOption(option =>
                option.setName('silent')
                .setDescription('sends the clock message silently')
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('view')
            .setDescription('check your time on the clock')
            .addBooleanOption(option =>
                option.setName('silent')
                .setDescription('sends the clock message silently')
                .setRequired(false)
            )
        ),
        async execute(interaction) {
            if (interaction.commandName != 'clock') { return; }

            if (interaction.options.getSubcommand() === 'in') {
                return await handleClockIn(interaction);
            } 
            if (interaction.options.getSubcommand() === 'out') {
                return await handleClockOut(interaction);
            }
            if (interaction.options.getSubcommand() === 'view') {
                return await handleClockView(interaction);
            }

            return;
        }
}

/**
 * 
 * @param {import('discord.js').CommandInteraction} interaction 
 * @returns 
 */
async function handleClockIn(interaction) {
    const clockedIn = clockIn(interaction.user.id);
    const displayName = interaction.member.displayName ?? interaction.user.displayName;

    let message = '';

    if (!clockedIn) {
        message += `❌ ${interaction.user} you're already clocked in dummy!!`;
    } else {
        message += `🟢 ${interaction.user} has clocked in. Have fun at work.`;
    }

    const embed = new EmbedBuilder()
        .setTitle(` `)
        .setDescription(message)
        .setColor(parseInt(config.colors.rainbow.at(Math.floor(Math.random()*config.colors.rainbow.length)).hex))
        .setAuthor({
            name: `${displayName}'s Clock`,
            iconURL: interaction.user.avatarURL()
        })
        .setTimestamp();
    await interaction.followUp({embeds: [embed]});
}

/**
 * 
 * @param {import('discord.js').CommandInteraction} interaction 
 * @returns 
 */
async function handleClockOut(interaction) {
    const clockedOut = clockOut(interaction.user.id);
    const strSessionTime = dateToString(clockedOut.sessionTime);
    const displayName = interaction.member.displayName ?? interaction.user.displayName;

    let message = '';
    if (clockedOut.sessionTime === -1) {
        message += `❌ ${interaction.user} you haven't clocked in yet idiot.`;
    } else {
        message += `🔴 ${interaction.user} has clocked out after ${strSessionTime}. Get back to living your sad live`;
    }

    const embed = new EmbedBuilder()
        .setTitle(` `)
        .setDescription(message)
        .setColor(parseInt(config.colors.rainbow.at(Math.floor(Math.random()*config.colors.rainbow.length)).hex))
        .setAuthor({
            name: `${displayName}'s Clock`,
            iconURL: interaction.user.avatarURL()
        })
        .setTimestamp();
    await interaction.followUp({embeds: [embed]});
}

/**
 * 
 * @param {import('discord.js').CommandInteraction} interaction 
 * @returns 
 */
async function handleClockView(interaction) {
    const clockTime = clockView(interaction.user.id);
    const strSessionTime = dateToString(clockTime.sessionTime);
    const strTotalTime = dateToString(clockTime.totalTime);
    const displayName = interaction.member.displayName ?? interaction.user.displayName;

    let message = '';
    if (clockTime.sessionTime > 0) {
        message += `🟢 Currently clocked in for ${strSessionTime}\n\n`;
    } else {
        message += `🔴 Currently clocked out\n\n`;
    }
    message += `Total time on the clock: ${strTotalTime}`;

    const embed = new EmbedBuilder()
        .setTitle(` `)
        .setDescription(message)
        .setColor(parseInt(config.colors.rainbow.at(Math.floor(Math.random()*config.colors.rainbow.length)).hex))
        .setAuthor({
            name: `${displayName}'s Clock`,
            iconURL: interaction.user.avatarURL()
        })
        .setTimestamp();
    await interaction.followUp({embeds: [embed]});
}
