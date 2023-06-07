import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'
import slash from 'slash'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const commandFiles = fs.readdirSync( __dirname).filter(file => file.endsWith('.js'));
// Loop through each file and import it as a command module
export async function getCommands() {
    let allCommands = [];
    for (const file of commandFiles) {
        if (file === 'COMBINE.js') continue;
        const modulePath = fileURLToPath(new URL(file, import.meta.url));
        const Command = await import(`file://${slash(modulePath)}`).then(module => module.default);
        allCommands.push(Command);
    }
    return allCommands;
}