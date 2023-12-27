const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const { clockOut } = require('../utils/timeclock.utils');
const { dateToString } = require('../utils/utils');
const { config } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clock-out')
        .setDescription('clock out of work and get back to your miserable life')
        .setDefaultMemberPermissions(0)
        .setDMPermission(true),
    /**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     * @returns 
     */
    async execute(interaction) {
        console.log(interaction.commandName);
        if (interaction.commandName != 'clock-out') { return; }
    
        const clockedOut = clockOut(interaction.user.id);
        const strSessionTime = dateToString(clockedOut.sessionTime);
        const displayName = interaction.member.displayName ?? interaction.user.displayName;

        let message;
        if (clockedOut.sessionTime === -1) {
            message = `❌ ${interaction.user} you haven't clocked in yet idiot.`;
        } else {
            message = `🔴 ${interaction.user} has clocked out after ${strSessionTime}. Get back to living your sad live`;
        }
    
        const embed = new EmbedBuilder()
            .setTitle(`${displayName}'s Clock`)
            .setDescription(message)
            .setColor(parseInt(config.colors.rainbow.at(Math.floor(Math.random()*config.colors.rainbow.length)).hex))
            .setTimestamp();
        await interaction.followUp({embeds: [embed]});
    }
}