#!/usr/bin/env node
import {Command} from "commander";
import fs from 'fs';
import path from 'path';
import { getCommands } from "./commands/COMBINE.js";
const program = new Command();
const commandsList = getCommands().then(async commands => {
    for (const Command of commands) {
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
})
// Loop through each file and import it as a command module

