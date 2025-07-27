const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder() 
        .setName('ping') 
        .setDescription('Donnne le ping du bot') 
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        const sent = await interaction.reply({content: 'Récupération du ping...', fetchReply: true, });
        ping = sent.createdTimestamp - interaction.createdTimestamp;
        api = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle('Ping')
            .setDescription(`Bot: \`${ping}\`\nApi: \`${api}\``);

        await interaction.editReply({ embeds: [embed] }); 
    }
};