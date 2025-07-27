const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    let eventCount = 0;
    let errorCount = 0;

    const loadEvents = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                loadEvents(filePath);
            } else if (file.endsWith('.js')) {
                try {
                    const event = require(filePath);
                    if ('name' in event && 'execute' in event) {
                        if (event.once) {
                            client.once(event.name, (...args) => event.execute(...args, client));
                        } else {
                            client.on(event.name, (...args) => event.execute(...args, client));
                        }
                        eventCount++;
                    } else {
                        console.warn(`❌ Event invalide : ${file} (manque 'name' ou 'execute')`);
                        errorCount++;
                    }
                } catch (error) {
                    console.error(`❌ Erreur lors du chargement de ${file} :`, error.message);
                    errorCount++;
                }
            }
        }
    };

    const eventsPath = path.join(__dirname, '..', 'events');
    
    if (!fs.existsSync(eventsPath)) {
        console.log('📁 Aucun dossier "events" trouvé');
        return;
    }

    loadEvents(eventsPath);

    if (eventCount > 0) {
        console.log(`✅ ${eventCount} event(s) chargé(s) avec succès`);
    }
    if (errorCount > 0) {
        console.log(`❌ ${errorCount} erreur(s) lors du chargement des events`);
    }
    if (eventCount === 0 && errorCount === 0) {
        console.log('📁 Aucun event trouvé dans le dossier events');
    }
};