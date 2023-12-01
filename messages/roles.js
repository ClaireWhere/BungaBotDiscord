const discord_announcements = require('./roles/discord_announcements.js');
const stream_announcements = require('./roles/stream_announcements.js');
const pronouns = require('./roles/pronouns.js');

module.exports = {
    async execute(interaction) {
        const roles = [await pronouns.execute(interaction), await discord_announcements.execute(interaction), await stream_announcements.execute(interaction)];
        return roles;
    }
}