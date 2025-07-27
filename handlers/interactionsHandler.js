const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
    const basePath = path.join(__dirname, '..', 'interactions');
    let buttonCount = 0;
    let selectCount = 0;
    let errorCount = 0;

    if (!fs.existsSync(basePath)) {
        console.log('📁 Aucun dossier "interactions" trouvé');
        return;
    }

    const folders = fs.readdirSync(basePath);

    for (const folder of folders) {
        const folderPath = path.join(basePath, folder);

        if (!fs.lstatSync(folderPath).isDirectory()) continue;

        const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

        for (const file of files) {
            const filePath = path.join(folderPath, file);

            try {
                const interaction = require(filePath);

                if (!interaction.customId || typeof interaction.execute !== 'function') {
                    console.warn(`❌ Interaction invalide : ${file} (dans ${folder})`);
                    errorCount++;
                    continue;
                }

                if (folder === 'buttons') {
                    client.buttons.set(interaction.customId, interaction);
                    buttonCount++;
                } else if (folder === 'selects') {
                    client.selectMenus.set(interaction.customId, interaction);
                    selectCount++;
                }
            } catch (error) {
                console.error(`❌ Erreur lors du chargement de ${file} :`, error.message);
                errorCount++;
            }
        }
    }

    // Résumé final
    const totalLoaded = buttonCount + selectCount;
    if (totalLoaded > 0) {
        let summary = `✅ ${totalLoaded} interaction(s) chargée(s) :`;
        if (buttonCount > 0) summary += ` ${buttonCount} bouton(s)`;
        if (selectCount > 0) summary += ` ${selectCount} menu(s)`;
        console.log(summary);
    }
    if (errorCount > 0) {
        console.log(`❌ ${errorCount} erreur(s) lors du chargement des interactions`);
    }
    if (totalLoaded === 0 && errorCount === 0) {
        console.log('📁 Aucune interaction trouvée dans le dossier interactions');
    }
};