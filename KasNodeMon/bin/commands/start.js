import * as fs from 'fs';
import * as path from 'path';
import {execa} from "execa";
import chalk from 'chalk';
export default class StartCommand {
    static command = 'start';
    static description = 'Start the server, launchable within the main or the server directory';

    static options = [
        {
            flags: '-d, --dir <dir>',
            description: 'Directory of kaspa node monitor instance',
            default: process.cwd()
        }
    ];
    static action(name, dir) {
        dir = name.dir;
        // Look for a package json file in the directory
        const packageJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
        if (!(packageJson.name === 'kaspanodemonitor') || !(packageJson.name === 'kaspanodemonitorbackend')) {
            console.log(chalk.redBright('No kaspa node monitor instance found in this directory'));
            return;
        } else {
            // If it's the main directory, go to the server directory
            if (packageJson.name === 'kaspanodemonitor') {
                dir = path.join(dir, 'server');
            }
            // Check if the server directory has a package json file
            const packageJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
            if (!(packageJson.name === 'kaspanodemonitorbackend')) {
                console.log(chalk.redBright('No kaspa node monitor instance found in this directory'));
                return;
            }
            // Run it!
            console.log(chalk.greenBright('Starting kaspa node monitor instance...'));
            // Start with execa make sure to output logs
            execa('npm', ['start'], {
                cwd: dir,
                stdio: 'inherit'
            });
        }
    }
}
