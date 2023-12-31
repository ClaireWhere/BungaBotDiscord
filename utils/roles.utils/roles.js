const { PermissionsBitField } = require('discord.js');
const { config } = require('../../config.json');
const { logger } = require('../logger');

/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @param {string} role_name 
 * @returns 
 */
function findRole(interaction, role_name) {
    var role = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === role_name.toLowerCase());
    if (!role) {
        return false;
    }
    return role;
}

/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @param {string} role_name 
 * @returns 
 */
async function removeExclusive(interaction, id) {
    if (id.length == 0) { return false; }
    
    var role_id = id[0];
    var root_element = config.roles;
    if (id.length > 1) {
        role_id = id[1];
        root_element = config.roles[id[0]];
    }

    if (!root_element) {
        return true;
    }
    if (!root_element.hasOwnProperty(role_id)) {
        return true;
    }
    if (!root_element[role_id].hasOwnProperty('exclusion')) {
        return true;
    }
    const exclusive = root_element[role_id].exclusion;
    if (exclusive === undefined || exclusive.length === 0) {
        return true;
    }

    for (let element of exclusive) {
        try {
            if (await memberHasRoleName(interaction, root_element[element].name)) {
                await removeFormatRole(interaction, root_element[element].name);
            }
        } catch (error) {
            logger.error(`error while removing exclusive roles for ${id} at ${element} (${error})`);
        }
    }
}

/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @param {string} role_name 
 * @returns 
 */
async function memberHasRoleName(interaction, role_name) {
    return await interaction.member.roles.cache.some(role => role.name === role_name);
}

/**
 * 
 * @param {import('discord.js').Interaction} interaction 
 * @param {import('discord.js').Role} role 
 * @returns 
 */
async function memberHasRole(interaction, role) {
    return await interaction.member.roles.cache.some(r => r.id === role.id);
}

/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @param {import("discord.js").Role} role 
 * @returns 
 */
async function addRole(interaction, role) {
    return await interaction.member.roles.add(role)
        .then((res) => {
            return true;
        })
        .catch(async (error) => {
            logger.error(`Unable not add role ${role ?? ''} (${error})`);
            await interaction.followUp({
                ephemeral: true,
                content: `Something went wrong adding your ${role ?? ''} role!` 
            }).catch((error) => {
                logger.error(`Unable to respond to add role interaction from ${interaction.member.user.username} for ${role ?? ''} (${error})`); 
            });
            return false;
        });
}

/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @param {string} role_name 
 * @returns 
 */
async function addRoleByName(interaction, role_name) {
    var role = interaction.guild.roles.cache.find(role => role.name === role_name);
    if (!role) { 
        await interaction.followUp({
            ephemeral: true,
            content: `Something went wrong adding your ${role_name} role!`
        }).catch((error) => {
            logger.error(`Unable to respond to add role by name interaction from ${interaction.member.user.username} for ${role_name} (${error})`);
        });
        return false; 
    }
    return await addRole(interaction, role);
}

/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @param {string} role_name 
 * @returns 
 */
async function addFormatRole(interaction, role_name) {
    var role = interaction.guild.roles.cache.find(role => role.name === role_name);
    if (!role) { return false; }
    const res = await addRole(interaction, role);
    if (!res) { return false; }
    
    
    return await interaction.followUp({ephemeral: true, content: `You now have the ${role} role!`})
        .then((res) => { return true; })
        .catch((error) => {
            logger.error(`Unable to respond to add role interaction from ${interaction.member.user.username} for ${role} (${error})`);
            return false;
        });
}

/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @param {import("discord.js").Role} role
 * @returns 
 */
async function removeRole(interaction, role) {
    return await interaction.member.roles.remove(role)
        .then((res) => { return true; })    
        .catch(async (error) => {
            logger.error(`Unable to remove role ${role.name} from ${interaction.member.user.username} (${error})`);
            await interaction.followUp({ephemeral: true, content: `Something went wrong removing your ${role ?? ''} role!`})
                .catch((error) => { logger.error(`Unable to respond to remove role interaction ${error}`); });
            return false;
        })
}


/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @param {string} role_name 
 * @returns 
 */
async function removeRoleByName(interaction, role_name) {
    var role = interaction.guild.roles.cache.find(role => role.name === role_name);
    if (!role) { 
        await interaction.followUp({
            ephemeral: true,
            content: `Something went wrong removing your ${role_name} role!`
        }).catch((error) => {
            logger.error(`Unable to respond to remove role by name interaction (${error})`);
        });
        return false; 
    }
    return await removeRole(interaction, role);
}

async function removeFormatRole(interaction, role_name) {
    var role = interaction.guild.roles.cache.find(role => role.name === role_name);
    if (!role) { return false; }
    const res = await removeRole(interaction, role);
    if (!res) { return false; }
    return await interaction.followUp({ephemeral: true, content: `You no longer have the ${role} role!`})
        .then((res) => { return true; })
        .catch((error) => {
            logger.error(`Unable to respond to remove role interaction (${error})`);
            return false;
        });
}



/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @param {string} role_name - the name of the role to toggle
 * @param {string} id - the role id of the role to toggle
 * @returns 
 */
async function toggleRole(interaction, role_name, id) {
    if (await memberHasRoleName(interaction, role_name)) {
        return await removeFormatRole(interaction, role_name);
    } else {
        await addFormatRole(interaction, role_name);
        await removeExclusive(interaction, id);
    }
    return true;
}


function getPermissionsFromArray(array) {
    if (array === undefined || array.length === 0) {
        return [];
    }
    var permissions = [];
    array.forEach(permission => {
        permissions.push(PermissionsBitField.Flags[permission]);
    });
    return permissions;
}


/**
 * gets the role position of the bot's role
 * @param {import('discord.js').Interaction} interaction 
 * @returns {Promise<number>}
 */
async function getBotRolePosition(interaction) {
    const botMember = await interaction.guild.members.fetch(interaction.client.user.id);
    const botRole = botMember.user.displayName;
    return interaction.guild.roles.cache.find( role => role.name === botRole && botMember.roles.cache.has(role.id) ).position;
}

module.exports = { removeExclusive, memberHasRoleName, memberHasRole, addRole, addRoleByName, addFormatRole, removeRole, removeRoleByName, removeFormatRole, toggleRole, findRole, getPermissionsFromArray, getBotRolePosition };