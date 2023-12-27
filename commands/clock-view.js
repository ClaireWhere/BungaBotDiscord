const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders');
const { clockView } = require('../utils/timeclock.utils');
const { config } = require('../config.json');
const { dateToString } = require('../utils/utils');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clock-view')
    .setDescription('check your time on the clock')
    .setDefaultMemberPermissions(0)
    .setDMPermission(true),
    /**
     * 
     * @param {import('discord.js').CommandInteraction} interaction 
     * @returns 
     */
    async execute(interaction) {
        console.log(interaction.commandName);
        if (interaction.commandName != 'clock-view') { return; }
    
        const clockTime = clockView(interaction.user.id);
        const strSessionTime = dateToString(clockTime.sessionTime);
        const strTotalTime = dateToString(clockTime.totalTime);

        const displayName = interaction.member.displayName ?? interaction.user.displayName;

        let message = ``
        if (clockTime.sessionTime > 0) {
            message += `🟢 Currently clocked in for ${strSessionTime}\n`;
        } else {
            message += `🔴 Currently clocked out\n`;
        }
        message += `\tTotal time on the clock: ${strTotalTime}`;
    
        console.log(message);
        console.log(config.colors.rainbow.at(Math.floor(Math.random()*config.colors.rainbow.length)))
        
        console.log(parseInt(config.colors.rainbow.at(Math.floor(Math.random()*config.colors.rainbow.length)).hex))

        const embed = new EmbedBuilder()
            .setTitle(`${displayName}'s Clock Time`)
            .setDescription(message)
            .setColor(parseInt(config.colors.rainbow.at(Math.floor(Math.random()*config.colors.rainbow.length)).hex))
            .setTimestamp();
        await interaction.followUp({embeds: [embed]});
    
        return;
    }
}