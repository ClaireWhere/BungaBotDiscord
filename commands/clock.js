const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders');
const { config } = require('../config.json');
const { dateToString } = require('../utils/utils');
const { clockView, clockIn, clockOut, getClock } = require('../utils/timeclock.utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clock')
		.setDescription('Manage your time spent on the clock for the streamer AAAAurora_')
		.setDefaultMemberPermissions(0)
		.setDMPermission(true)
        .addSubcommand(subcommand =>
            subcommand.setName('in')
            .setDescription('clock in for work 😎')
            .addBooleanOption(option =>
                option.setName('silent')
                .setDescription('sends the clock message silently')
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('out')
            .setDescription('clock out of work 😔')
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
        )
        .addSubcommand(subcommand =>
            subcommand.setName('display')
            .setDescription('display everyone\'s time on the clock')
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
            if (interaction.options.getSubcommand() === 'display') {
                return await handleClockDisplay(interaction);
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
        message += `❌ WHOA THERE ${interaction.user} you're already clocked in!!`;
    } else {
        message += `🟢 ${interaction.user} has clocked in. Woohooo!!! Have a great day!!!`;
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
        message += `❌ Hold your horses ${interaction.user} you haven't clocked in!`;
    } else {
        message += `🔴 ${interaction.user} has clocked out after ${strSessionTime}. COME BACK PLSSSSSS 😭😭😭`;
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

    let message = `⏱️ Total time on the clock: ${strTotalTime}\n`;
    if (clockTime.sessionTime > 0) {
        message += `🟢 Currently clocked in for: ${strSessionTime}`;
    } else {
        message += `🔴 Currently clocked out`;
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
async function handleClockDisplay(interaction) {
    const clockData = getClock();

    // Order all workers descending by time on the clock
    clockData.workers.sort((a, b) => {
        return (b.time + (b.clocked_in === -1 ? 0 : new Date() - new Date(b.clocked_in))) - (a.time + (a.clocked_in === -1 ? 0 : new Date() - new Date(a.clocked_in)));
    });

    let message = '';
    for (const worker of clockData.workers) {
        const sessionTime = worker.clocked_in === -1 ? 0 : new Date() - new Date(worker.clocked_in);
        const strTotalTime = dateToString(worker.time + sessionTime);
        const clockedIn = sessionTime === 0 ? '🔴 Not currently clocked in' : `🟢 Currently clocked in for: ${dateToString(sessionTime)}`;
        message += `### <@${worker.id}>:\n  ⏱️ Total time: ${strTotalTime}\n  ${clockedIn}\n\n`;
    }

    const embed = new EmbedBuilder()
        .setTitle(' ')
        .setDescription(message)
        .setColor(parseInt(config.colors.rainbow.at(Math.floor(Math.random()*config.colors.rainbow.length)).hex))
        .setAuthor({
            name: `${interaction.guild.name} Clock`,
            iconURL: interaction.guild.iconURL()
        })
        .setTimestamp();
    await interaction.followUp({embeds: [embed]});
}