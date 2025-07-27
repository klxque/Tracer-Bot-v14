module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'Erreur lors de la commande.', ephemeral: true });
        } else {
          await interaction.reply({ content: 'Erreur lors de la commande.', ephemeral: true });
        }
      }
    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;

      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.error(error);
        if (!interaction.replied) {
          await interaction.reply({ content: 'Erreur bouton.', ephemeral: true });
        }
      }
    } else if (interaction.isSelectMenu()) {
      const selectMenu = client.selectMenus.get(interaction.customId);
      if (!selectMenu) return;

      try {
        await selectMenu.execute(interaction, client);
      } catch (error) {
        console.error(error);
        if (!interaction.replied) {
          await interaction.reply({ content: 'Erreur menu.', ephemeral: true });
        }
      }
    }
  }
};
