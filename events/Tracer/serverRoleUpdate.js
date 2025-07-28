const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../../config.json');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        try {
            const guild = newMember.guild;
            if (guild.id !== config.serveurTracer) return;

            const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
            const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
            
            if (addedRoles.size > 0) {
                await handleRoleAdd(guild, newMember, addedRoles);
            }

            if (removedRoles.size > 0) {
                await handleRoleRemove(guild, newMember, removedRoles)
            }

        } catch (error) {
            console.error('Erreur dans GuildMemberUpdate:', error);
        }
    }
};

async function handleRoleAdd(guild, member, addedRoles) {
    const targetGuild = member.client.guilds.cache.get(config.serveurTracage);
    if (!targetGuild) {
        console.log('Serveur de destination introuvable');
        return;
    }

    const addChannelId = await db.get(`tracer_${targetGuild.id}_add`);
    
    const addChannel = targetGuild.channels.cache.get(addChannelId);
    if (!addChannel) {
        return;
    }

    const auditLogs = await guild.fetchAuditLogs({ 
        type: AuditLogEvent.MemberRoleUpdate, 
        limit: 5 
    });

    for (const role of addedRoles.values()) {
        
        const roleUpdateLog = auditLogs.entries.find(entry => {
            if (entry.target?.id !== member.id) return false;
            if (Date.now() - entry.createdTimestamp > 5000) return false;
            
            return entry.changes?.some(change => 
                change.key === '$add' && 
                change.new?.some(r => r.id === role.id)
            );
        });

        const executor = roleUpdateLog?.executor;

        const embed = new EmbedBuilder()
            .setTitle("➕・Rôle ajouté")
            .addFields(
                { name: "Membre :", value: `<@${member.id}>`, inline: true },
                { name: "Rôle ajouté :", value: `\`${role.name}\` \`(${role.id})\``, inline: true },
                { name: "Ajouté par :", value: executor ? `<@${executor.id}>` : "*Inconnu*", inline: true }
            )
            .setColor("Green")
            .setTimestamp();

        await addChannel.send({ embeds: [embed] });
    }
}

async function handleRoleRemove(guild, member, removedRoles) {
    const targetGuild = member.client.guilds.cache.get(config.serveurTracage);
    if (!targetGuild) {
        console.log('Serveur de destination introuvable');
        return;
    }

    const removeChannelId = await db.get(`tracer_${targetGuild.id}_remove`);
    
    const removeChannel = targetGuild.channels.cache.get(removeChannelId);
    if (!removeChannel) {
        return;
    }

    const auditLogs = await guild.fetchAuditLogs({ 
        type: AuditLogEvent.MemberRoleUpdate, 
        limit: 5 
    });

    for (const role of removedRoles.values()) {
        
        const roleUpdateLog = auditLogs.entries.find(entry => {
            if (entry.target?.id !== member.id) return false;
            if (Date.now() - entry.createdTimestamp > 5000) return false;
            
            return entry.changes?.some(change => 
                change.key === '$remove' && 
                change.new?.some(r => r.id === role.id)
            );
        });

        const executor = roleUpdateLog?.executor;

        const embed = new EmbedBuilder()
            .setTitle("➖・Rôle supprimé")
            .addFields(
                { name: "Membre :", value: `<@${member.id}>`, inline: true },
                { name: "Rôle supprimé :", value: `\`${role.name}\` \`(${role.id})\``, inline: true },
                { name: "Supprimé par :", value: executor ? `<@${executor.id}>` : "*Inconnu*", inline: true }
            )
            .setColor("Red")
            .setTimestamp();

        await removeChannel.send({ embeds: [embed] });
    }
}