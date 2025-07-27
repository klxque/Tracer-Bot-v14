const { Events, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../../config.json');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const guild = newState.guild || oldState.guild;
        const user = newState.member || oldState.member;
        const channel = newState.channel || oldState.channel;
        const guildTarget = (newState.member || oldState.member).client.guilds.cache.get(config.serveurTracage)

        if (guild.id !== config.serveurTracer) return;

        const voiceUpdateChannelId = await db.get(`tracer_${guildTarget.id}_voice`);

        const voiceUpdateChannel = await guildTarget.channels.cache.get(voiceUpdateChannelId)

        if (!voiceUpdateChannel) {
            return;
        }

        if (!oldState.channel && newState.channel) {
            const embed = new EmbedBuilder()
                .setTitle("➕・Vocal Rejoint")
                .addFields(
                    { name: "Membre :", value: `${user}`, inline: true },
                    { name: "Salon :", value: `${channel}`, inline: true }
                )
                .setColor('Green')

            await voiceUpdateChannel.send({ embeds: [embed ]})
        }

        if (oldState.channel && !newState.channel) {
            const embed2 = new EmbedBuilder()
                .setTitle("➖・Vocal Quitté")
                .addFields(
                    { name: "Membre", value: `${user}`, inline: true },
                    { name: "Salon :", value: `${channel}` }
                )
                .setColor('Red')
            
            await voiceUpdateChannel.send({ embeds: [embed2] })
        }

        if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            const embed3 = new EmbedBuilder()
                .setTitle('🔁・Changement de Salons')
                .addFields(
                    { name: "Membre :", value: `${user}`, inline: true },
                    { name: "Ancien Salon :", value: `${oldState.channel}`, inline: true },
                    { name: "Nouveau Salon :", value: `${newState.channel}`, inline: true }
                )
                .setColor('Orange')

            await voiceUpdateChannel.send({ embeds: [embed3] })
        }

        if (oldState.streaming !== newState.streaming) {
            const channel = newState.channel || oldState.channel;
            
            if (newState.streaming) {
                const embed4 = new EmbedBuilder()
                    .setTitle("🎬・Stream Activé")
                    .addFields(
                        { name: "Membre :", value: `${user}`, inline: true },
                        { name: "Salon :", value: `${channel}`, inline: true },
                        { name: "Serveur :", value: guild.name, inline: false }
                    )
                    .setColor('Green')
                    .setTimestamp();

                await voiceUpdateChannel.send({ embeds: [embed4] });
            } else {
                const embed5 = new EmbedBuilder()
                    .setTitle("🎬・Stream Désactivé")
                    .addFields(
                        { name: "Membre :", value: `${user}`, inline: true },
                        { name: "Salon :", value: `${channel}`, inline: true },
                        { name: "Serveur :", value: guild.name, inline: false }
                    )
                    .setColor('Red')
                    .setTimestamp();

                await voiceUpdateChannel.send({ embeds: [embed5] });
            }
        }

        if (oldState.selfVideo !== newState.selfVideo) {
            const channel = newState.channel || oldState.channel;
            
            if (newState.selfVideo) {
                const embed6 = new EmbedBuilder()
                    .setTitle("🎥・Caméra Activée")
                    .addFields(
                        { name: "Membre :", value: `${user}`, inline: true },
                        { name: "Salon :", value: `${channel}`, inline: true },
                        { name: "Serveur :", value: guild.name, inline: false }
                    )
                    .setColor('Green')
                    .setTimestamp();

                await voiceUpdateChannel.send({ embeds: [embed6] });
            } else {
                const embed7 = new EmbedBuilder()
                    .setTitle("🎥・Caméra Désactivée")
                    .addFields(
                        { name: "Membre :", value: `${user}`, inline: true },
                        { name: "Salon :", value: `${channel}`, inline: true },
                        { name: "Serveur :", value: guild.name, inline: false }
                    )
                    .setColor('Red')
                    .setTimestamp();

                await voiceUpdateChannel.send({ embeds: [embed7] });
            }
        }
    }
}