const fs = require('node:fs');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const { logger } = require('./utils/logger');
require('dotenv').config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    let message;
    try {
        commands.push(command.data.toJSON());
        message = `loaded command from file ./commands/${file}`;
        
    } catch (error) {
        message = `could not load command from file: ./commands/${file} - ${error}`;
    }
    logger.debug(message);
    console.log(message);
}

const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {body: commands})
    .then(() => console.log('Successfully registered application commands'))
    .catch(console.error);