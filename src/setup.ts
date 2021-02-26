import Enmap from 'enmap';
import fs from 'fs';
import reader from 'readline-sync';
import { defaultSettings } from './modules/functions';

let baseConfig = fs.readFileSync(`${__dirname}/../config.js.example`, 'utf8');

const settings = new Enmap({
    name: 'settings',
    cloneLevel: 'deep',
    ensureProps: true,
});

(async function () {
    if (fs.existsSync(`${__dirname}/config/config.js`)) {
        process.exit(0);
    }
    console.log('Setting Up Configuration...');
    await settings.defer;

    console.log(
        'First Start! Inserting default guild settings in the database...',
    );
    settings.set('default', defaultSettings);

    console.log('Enter your discord API token: ');
    const TOKEN = reader.question('');
    console.log('Enter your Pterodactyl API token: ');
    const PTERO_TOKEN = reader.question('');
    console.log(
        'Enter your Pterodactyl HOST address (https://panel.example.com): ',
    );
    const PTERO_HOST = reader.question('');

    baseConfig = baseConfig.replace('TOKEN', `${TOKEN}`);
    baseConfig = baseConfig.replace('PTERO_TOKEN', `${PTERO_TOKEN}`);
    baseConfig = baseConfig.replace('PTERO_HOST', `${PTERO_HOST}`);

    fs.writeFileSync(`${__dirname}/config/config.js`, baseConfig);
    console.log('REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!');
    console.log('Configuration has been written, enjoy!');
    await settings.close();
})();
