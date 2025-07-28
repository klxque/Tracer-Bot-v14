const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.author?.bot) {
            return;
        }

        if (!message.author) {
            return;
        }

        const guild = message.guild;
        const user = message.author;
        const channel = message.channel;
        const mainGuild = message.client.guilds.cache.get(config.serveurTracage);

        const messageDeleteChannelId = await db.get(`tracer_${mainGuild.id}_messageDelete`);

        const messageDeleteChannel = await mainGuild.channels.cache.get(messageDeleteChannelId);

        if (!messageDeleteChannel) {
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("🗑️・Message Suprimmé")
            .setThumbnail(user.displayAvatarURL())
            .setColor('Red')
            .addFields(
                { name: `Message Suprimmé :`, value: message.content || '*Aucun*', inline: true },
                { name: "Salon :", value: `<#${channel.id}>`, inline: true },
                { name: "Membre :", value: `<@${user.id}>`, inline: true }
            )
            .setTimestamp()

        if (messageDeleteChannel) {
            await messageDeleteChannel.send({ embeds: [embed] })
        }
    }
}