const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    let commandCount = 0;
    let errorCount = 0;

    const loadCommands = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                loadCommands(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.js')) {
                try {
                    const command = require(fullPath);
                    if ('data' in command && 'execute' in command) {
                        client.commands.set(command.data.name, command);
                        commandCount++;
                    } else {
                        console.warn(`❌ Commande invalide : ${entry.name} (manque 'data' ou 'execute')`);
                        errorCount++;
                    }
                } catch (error) {
                    console.error(`❌ Erreur lors du chargement de ${entry.name} :`, error.message);
                    errorCount++;
                }
            }
        }
    };

    const commandsPath = path.join(__dirname, '..', 'commands');
    
    if (!fs.existsSync(commandsPath)) {
        console.log('📁 Aucun dossier "commands" trouvé');
        return;
    }

    loadCommands(commandsPath);

    if (commandCount > 0) {
        console.log(`✅ ${commandCount} commande(s) chargée(s) avec succès`);
    }
    if (errorCount > 0) {
        console.log(`❌ ${errorCount} erreur(s) lors du chargement des commandes`);
    }
    if (commandCount === 0 && errorCount === 0) {
        console.log('📁 Aucune commande trouvée dans le dossier commands');
    }
};