#!/usr/bin/env node
import {Command} from "commander";
import fs from 'fs';
import path from 'path';
const program = new Command();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Find all files in the commands directory
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

// Loop through each file and import it as a command module
for (const file of commandFiles) {
    const Command = await import(path.join(__dirname, 'commands', file)).then(module => module.default);
    const pg = program
        .command(Command.command)
        .description(Command.description)
        .action(Command.action);
    // Add options if they exist
    if (Command.options) {
        for (const option of Command.options) {
            pg.option(option.flags, option.description, option.default);
        }
    }
}

// Parse the command line arguments
program.parse(process.argv);
