const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Configure le système de traçage des rôles")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            await interaction.reply({content: 'Setup du bot en cours...', fetchReply: true, ephemeral: true });

            const guild = interaction.guild;

            const existingCategoryId = await db.get(`tracer_${guild.id}_category`);
            const existingAddId = await db.get(`tracer_${guild.id}_add`);
            const existingRemoveId = await db.get(`tracer_${guild.id}_remove`);
            const existingVoiceId = await db.get(`tracer_${guild.id}_voice`);
            const existingCameraId = await db.get(`tracer_${guild.id}_camera`);
            const existingStreamId = await db.get(`tracer_${guild.id}_stream`);
            const existingMessageUpdateId = await db.get(`tracer_${guild.id}_messageUpdate`);
            const existingMessageDeleteId = await db.get(`tracer_${guild.id}_messageDelete`);

            if (existingCategoryId) {
                const existingCategory = guild.channels.cache.get(existingCategoryId);
                const existingAdd = guild.channels.cache.get(existingAddId);
                const existingRemove = guild.channels.cache.get(existingRemoveId);
                const existingVoice = guild.channels.cache.get(existingVoiceId);
                const existingCamera = guild.channels.cache.get(existingCameraId);
                const existingStream = guild.channels.cache.get(existingStreamId);
                const existingMessageUpdate = guild.channels.cache.get(existingMessageUpdateId);
                const existingMessageDelete = guild.channels.cache.get(existingMessageDeleteId);

                if (existingCategory) {
                    await existingCategory.delete();
                    await db.delete(`tracer_${guild.id}_category`);
                }

                if (existingAdd) {
                    await existingAdd.delete();
                    await db.delete(`tracer_${guild.id}_add`);
                }
                
                if (existingRemove) {
                    await existingRemove.delete();
                    await db.delete(`tracer_${guild.id}_remove`);
                }
                
                if (existingVoice) {
                    await existingVoice.delete();
                    await db.delete(`tracer_${guild.id}_voice`);
                }
                
                if (existingCamera) {
                    await existingCamera.delete();
                    await db.delete(`tracer_${guild.id}_camera`);
                }
                
                if (existingStream) {
                    await existingStream.delete();
                    await db.delete(`tracer_${guild.id}_stream`);
                }

                if (existingMessageUpdate) {
                    await existingMessageUpdate.delete();
                    await db.delete(`tracer_${guild.id}_messageUpdate`);
                }

                if (existingMessageDelete) {
                    await existingMessageDelete.delete();
                    await db.delete(`tracer_${guild.id}_messageDelete`)
                }
                
            }

            const category = await guild.channels.create({
                name: 'Tracer by Klxque',
                type: 4,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: guild.members.me.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.EmbedLinks
                        ]
                    }
                ]
            });

            const roleAdd = await guild.channels.create({
                name: 'role-add',
                type: 0,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: guild.members.me.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.EmbedLinks
                        ]
                    }
                ]
            });

            const roleRemove = await guild.channels.create({
                name: 'role-remove',
                type: 0,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: guild.members.me.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.EmbedLinks
                        ]
                    }
                ]
            });

            const voiceUpdate = await guild.channels.create({
                name: "vocal-update",
                type: 0,
                parent: category.id,
                permissionOverwrites: []
            })

            const cameraUpdate = await guild.channels.create({
                name: "camera-update",
                type: 0,
                parent: category.id,
                permissionOverwrites: []
            })

            const streamUpdate = await guild.channels.create({
                name: "stream-update",
                type: 0,
                parent: category.id,
                permissionOverwrites: []
            })

            const messageUpdate = await guild.channels.create({
                name: "message-update",
                type: 0,
                parent: category.id,
                permissionOverwrites: []
            })

            const messageDelete = await guild.channels.create({
                name: "message-delete",
                type: 0,
                parent: category.id,
                permissionOverwrites: []
            })

            await db.set(`tracer_${guild.id}_add`, roleAdd.id);
            await db.set(`tracer_${guild.id}_remove`, roleRemove.id);
            await db.set(`tracer_${guild.id}_category`, category.id);
            await db.set(`tracer_${guild.id}_voice`, voiceUpdate.id);
            await db.set(`tracer_${guild.id}_camera`, cameraUpdate.id);
            await db.set(`tracer_${guild.id}_stream`, streamUpdate.id);
            await db.set(`tracer_${guild.id}_messageUpdate`, messageUpdate.id);
            await db.set(`tracer_${guild.id}_messageDelete`, messageDelete.id);

            await interaction.editReply({
                content: "✅ Les salons de trace ont été créés en privé et enregistrés.",
                ephemeral: true
            });

        } catch (error) {
            console.error('Erreur lors de la configuration:', error);
            await interaction.editReply({
                content: "❌ Une erreur est survenue lors de la configuration.",
                ephemeral: true
            });
        }
    }
};