const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (newMessage.author.bot) {
            return;
        }

        if (oldMessage.content === newMessage.content) {
            return;
        }

        const guild = newMessage.guild || oldMessage.guild;
        const user = newMessage.author || oldMessage.author;
        const channel = newMessage.channel || oldMessage.channel;
        const mainGuild = newMessage.client.guilds.cache.get(config.serveurTracage) || oldMessage.client.guilds.cache.get(config.serveurTracage);

        const messageUpdateChannelId = await db.get(`tracer_${mainGuild.id}_messageUpdate`)

        const messageUpdateChannel = await mainGuild.channels.cache.get(messageUpdateChannelId);

        if (!messageUpdateChannel) {
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("✏️・Message Modifé")
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: "Ancien message :", value: oldMessage.content || '*Aucun*', inline: true },
                { name: "Nouveau message :", value: newMessage.content || '*Aucun*', inline: true },
                { name: "Salon :", value: `<#${channel.id}>`, inline: true },
                { name: "Membre :", value: `<@${user.id}> \`(${user.id})\``, inline: true }
            )
            .setTimestamp()
            .setColor('Orange')

        if (messageUpdateChannel) {
            await messageUpdateChannel.send({ embeds: [embed] });
        }
    }
}