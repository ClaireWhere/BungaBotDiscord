const fs = require('fs');
const { Client, Collection, Events, GatewayIntentBits, ActivityType, InteractionType } = require('discord.js');
require('dotenv').config();
const { config } = require('./config.json');
const { logger } = require('./utils/logger');

logger.info(`Starting client...`);

// Set Presence
function getPresence() {
    if (config.hasOwnProperty('custom_presence')) {
        if (!config.custom_presence.hasOwnProperty('enabled')) {
            logger.warn(`custom_presence.enabled is not defined in config.json. Defaulting to no presence`);
            return {};
        } else if (!config.custom_presence.enabled) {
            logger.debug(`custom_presence.enabled is false. Setting no presence`);
            return {};
        }
        const valid_statuses = ['online', 'idle', 'dnd', 'offline'];
        let status = valid_statuses[0];
        if (config.custom_presence.hasOwnProperty('status')) {
            if (valid_statuses.includes(config.custom_presence.status)) {
                status = config.custom_presence.status;
            } else {
                logger.warn(`custom_presence.status (\"${config.custom_presence.status}\") is not a valid status. Defaulting to \"${status}\"`);
            }
        } else {
            logger.warn(`custom_presence.status is not defined in config.json. Defaulting to \"${status}\"`);
        }

        return {
            activities: [
                {
                    type: ActivityType.Custom,
                    state: config.custom_presence.state ?? '',
                    name: ''
                }
            ],
            status: status
        }

    }
    return undefined;
}
const presence = getPresence();
if (presence) {
    logger.debug(`Custom status is enabled\n\t${JSON.stringify(presence)}`);
} else {
    logger.debug(`Custom status is disabled`);
}

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
    presence: getPresence()
});
logger.info(`Client initialized`)


// Initialize Events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
logger.info(`Found ${eventFiles.length} events`);

for (const file of eventFiles) {
    logger.debug(`registering event: ${file} (./events/${file})`);
    const event = require(`./events/${file}`);
    logger.debug(`loaded event: ${event.name} from ${file}`);
    if (event.once) {
        logger.debug(`registering once event: ${event.name} from ${file}`);
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        logger.debug(`registering event: ${event.name} from ${file}`);
        client.on(event.name, (...args) => event.execute(...args));
    }
    logger.info(`registered event: ${event.name} from ${file}`)
}


// Initialize Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
logger.info(`Found ${commandFiles.length} commands`);

for (const file of commandFiles) {
    logger.debug(`initializing command: ${file} (./commands/${file})`);
    const command = require(`./commands/${file}`);
    logger.debug(`loaded command: ${command.data.name} from ${file}`)
    try {
        client.commands.set(command.data.name, command);
        logger.info(`initialized command: ${command.data.name}`);
    } catch (error) {
        logger.error(`could not load command from file ${file}: ${error}`);
    }
}

// Command handler
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    logger.info(`received ${InteractionType[interaction.type]} interaction /${interaction.commandName} from ${interaction.member.user.username}`);

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    // indicates command names that are not ephemeral by default;
    const persistentCommands = ['clock'];
    const isEphemeral = !persistentCommands.includes(interaction.commandName);
    const isSilent = interaction.options.get('silent') ? interaction.options.get('silent').value : isEphemeral;

    if (!await interaction.deferReply({ ephemeral: isSilent })
            .then((res) => {
                logger.info(`/${interaction.commandName} command deferred`);
                return true;
            }).catch((error) => {
                logger.warn(`/${interaction.commandName} could not be deferred (${error})`);
                return false;
            })
    ) {
        return false;
    }

    await command.execute(interaction)
        .then((res) => {
            logger.info(`${interaction.commandName} command execution completed with status ${res}`)
        }).catch(async (error) => {
            await interaction.followUp({content: 'There was an error D:', ephemeral: true})
                .then(() => {
                    logger.warn(`${interaction.commandName} command executed with error (${error}).\n\tApplication successfully sent error message`)
                }).catch((err) => {
                    logger.error(`${interaction.commandName} command was unable to be executed. Application did not respond in time:\n\t${error}\n\t${err}`);
                    return false;
                });
        });
    
});

client.login(process.env.DISCORD_TOKEN);