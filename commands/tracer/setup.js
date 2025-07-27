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
            const guild = interaction.guild;

            const existingCategoryId = await db.get(`tracer_${guild.id}_category`);
            const existingAddId = await db.get(`tracer_${guild.id}_add`);
            const existingRemoveId = await db.get(`tracer_${guild.id}_remove`);
            const existingVoiceId = await db.get(`tracer_${guild.id}_voice`)

            if (existingCategoryId) {
                const existingCategory = guild.channels.cache.get(existingCategoryId);
                const existingAdd = guild.channels.cache.get(existingAddId);
                const existingRemove = guild.channels.cache.get(existingRemoveId);
                const existingVoice = guild.channels.cache.get(existingVoiceId);
                if (existingCategory) {
                    await existingCategory.delete();
                    await existingAdd.delete();
                    await existingRemove.delete();
                    await existingVoice.delete();
                }
                await db.delete(`tracer_${guild.id}_add`);
                await db.delete(`tracer_${guild.id}_remove`);
                await db.delete(`tracer_${guild.id}_voice`)
                await db.delete(`tracer_${guild.id}_category`);
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
                name: "vocal",
                type: 0,
                parent: category.id,
                permissionOverwrites: []
            })

            await db.set(`tracer_${guild.id}_add`, roleAdd.id);
            await db.set(`tracer_${guild.id}_remove`, roleRemove.id);
            await db.set(`tracer_${guild.id}_category`, category.id);
            await db.set(`tracer_${guild.id}_voice`, voiceUpdate.id)

            await interaction.reply({
                content: "✅ Les salons de trace ont été créés en privé et enregistrés.",
                ephemeral: true
            });

        } catch (error) {
            console.error('Erreur lors de la configuration:', error);
            await interaction.reply({
                content: "❌ Une erreur est survenue lors de la configuration.",
                ephemeral: true
            });
        }
    }
};