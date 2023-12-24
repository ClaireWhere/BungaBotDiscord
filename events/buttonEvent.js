const { Events } = require('discord.js');

const { config } = require('../config.json');
const { colorHandler } = require('../utils/roles.utils/color_roles.js')
const { toggleRole } = require('../utils/roles.utils/roles.js')
const { logger } = require('../utils/logger.js');

module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     * @returns 
     */
    async execute(interaction) {
        if (!interaction.isButton()) { return false; }

        logger.info(`received ${this.name.toString()} interaction with id ${interaction.customId} from ${interaction.member.user.username}`);

        // categorized button id's take the form parent:child. Eg. pronouns:she_her is part of the pronouns category with the child id being she_her. See more in config.json
        const id = interaction.customId.split(':');
        if (id.length === 0) { 
            logger.warn(`No button id found for the supplied button interaction`);
            await interaction.followUp({ephemeral: true, content: `There was an error! It looks like the button you clicked was invalid 🤔`});
            return false;
        }

        if (!await interaction.deferUpdate()
                .then((res) => {
                    logger.info(`${interaction.customId} interaction deferred`);
                    return true;
                }).catch((error) => {
                    logger.warn(`${interaction.customId} could not be deferred (${error})`);
                    return false;
                })
        ) {
            return false;
        }

        const interaction_type = id.shift();


        if (interaction_type === 'color') {
            return await colorHandler(interaction, id[0]);
        }

        
        function getRoleName(id) {
            if (id.length < 1) { 
                logger.debug(`specified button id is not valid role type: ${id.toString()}`);
                return undefined; 
            }

            if (id.length == 1) {
                const role = config.roles[id[0]];
                if (!role) { 
                    logger.debug(`no role found for button: ${id.toString()}`);
                    return undefined;
                }
                return role.hasOwnProperty('name') ? role.name : undefined;
            } else {
                const role = config.roles[id[0]][id[1]];
                if (!role) { 
                    logger.debug(`no role found for button: ${id.toString()}`);
                    return undefined; 
                }
                return role.hasOwnProperty('name') ? role.name : undefined;
            }
        }

        if (interaction_type === 'role') {
            const role_name = getRoleName(id);
            if (role_name === undefined || role_name.length === 0) { 
                logger.warn(`no role found for ${id.toString()}!`);
                await interaction.followUp({ephemeral: true, content: `Something went wrong finding the role you selected D:`})
                    .catch((error) => {logger.error(`could not follow up on add role from ${interaction.member.user.username} for ${interaction.customId} (${error})`)}); 
                return false;
            }

            logger.debug(`found role ${role_name} for button: ${id.toString()}`);

            await toggleRole(interaction, role_name, id);
            logger.info(`toggled role ${role_name} for button: ${id.toString()}`);
            return true;
        }
        
        logger.warn(`no handler found for button: ${interaction_type}:${id.toString()}!`);
        await interaction.followUp({ephemeral: true, content: `Something went wrong finding the button you clicked D:`})
            .catch((error) => {logger.error(`could not follow up on button click from ${interaction.member.user.username} for ${interaction.customId} (${error})`)});
        return false;
    },
};
