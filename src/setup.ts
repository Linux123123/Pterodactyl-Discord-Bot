import fs from 'fs';
import reader from 'readline-sync';
import { config } from './config/config';

let baseConfig = fs.readFileSync(`${__dirname}/config/config.js`, 'utf8');
let baseSrcConfig = fs.readFileSync(
    `${__dirname}/../src/config/config.ts`,
    'utf8',
);

if (config.token === 'TOKEN') {
    console.log('Enter your discord API token: ');
    const TOKEN = reader.question();
    baseConfig = baseConfig.replace('TOKEN', `${TOKEN}`);
    baseSrcConfig = baseSrcConfig.replace('TOKEN', `${TOKEN}`);
}
if (config.pteroHost === 'PTERO_HOST') {
    console.log('Enter your pterodactyl API token: ');
    const PTERO_HOST = reader.question();
    baseConfig = baseConfig.replace('PTERO_HOST', `${PTERO_HOST}`);
    baseSrcConfig = baseSrcConfig.replace('PTERO_HOST', `${PTERO_HOST}`);
}
if (config.pteroToken === 'PTERO_TOKEN') {
    console.log(
        'Enter your pterodactyl host url (https://panel.example.com): ',
    );
    const PTERO_TOKEN = reader.question();
    baseConfig = baseConfig.replace('PTERO_TOKEN', `${PTERO_TOKEN}`);
    baseSrcConfig = baseSrcConfig.replace('PTERO_TOKEN', `${PTERO_TOKEN}`);
}

fs.writeFileSync(`${__dirname}/config/config.js`, baseConfig);
fs.writeFileSync(`${__dirname}/../src/config/config.ts`, baseSrcConfig);
