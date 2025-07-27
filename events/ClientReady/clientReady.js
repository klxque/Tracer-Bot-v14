const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ Le bot est prêt ! Connecté en tant que ${client.user.tag}.`);

        client.user.setPresence({
            activities: [{ name: "klxque", type: ActivityType.Watching }],
        });

        await client.user.setPresence({
            status: 'idle'
        });
    },
};
