const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { clockIn } = require('../utils/timeclock.utils');
const { config } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clock-in')
        .setDescription('clock in for work 😔')
        .setDefaultMemberPermissions(0)
        .setDMPermission(true),
    /**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     * @returns 
     */
    async execute(interaction) {
        console.log(interaction.commandName);
        if (interaction.commandName != 'clock-in') { return; }
    
        const clockedIn = clockIn(interaction.user.id);
        const displayName = interaction.member.displayName ?? interaction.user.displayName;
        
        let message;

        if (!clockedIn) {
            message = `❌ ${interaction.user} you're already clocked in dummy!!`;
        } else {
            message = `🟢 ${interaction.user} has clocked in. Have fun at work.`;
        }
    
        const embed = new EmbedBuilder()
            .setTitle(`${displayName}'s Clock`)
            .setDescription(message)
            .setColor(parseInt(config.colors.rainbow.at(Math.floor(Math.random()*config.colors.rainbow.length)).hex))
            .setTimestamp();
        await interaction.followUp({embeds: [embed]});
    }
}