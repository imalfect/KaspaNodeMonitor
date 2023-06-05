import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import fetch from "node-fetch";
import ora from "ora";
import cliSpinners from "cli-spinners";
import getMonitorVersion from "../util/getMonitorVersion.js";
export default class HelloCommand {
    static command = 'checkUpdates';
    static description = 'Check for updates of Kaspa Node Monitor';
    static options = [
        {
            flags: '-d, --dir <dir>',
            description: 'Directory of Kaspa Node Monitor instance, main folder',
            default: process.cwd()
        }
    ];
    static async action(dir) {
        dir = dir.dir
        const spinner = ora({
            text: 'Checking for updates...',
            spinner: cliSpinners.bouncingBar
        }).start();
        // Check latest release version from GitHub
        const latestRelease = await fetch('https://api.github.com/repos/imalfect/KaspaNodeMonitor/releases/latest').then(res => res.json());
        spinner.stop();
        const latestVersion = latestRelease.tag_name;
        // Get version list
        const versions = await getMonitorVersion(dir);
        if (latestVersion === versions.main) {
            console.log(chalk.greenBright(`You are running the latest version of Kaspa Node Monitor on ${chalk.bold("the main folder")} (${latestVersion})`));
        } else {
            console.log(chalk.yellowBright(`You are running an outdated version of Kaspa Node Monitor on ${chalk.bold("the main folder")} (${versions.main}). The latest version is ${latestVersion}.`));
        }
        // Check for package.json in the server folder
        if (latestVersion === versions.server) {
            console.log(chalk.greenBright(`You are running the latest version of Kaspa Node Monitor on ${chalk.bold("the server folder")} (${latestVersion})`));
        } else if (versions.server === '') {
            console.log(chalk.yellowBright(`It appears that you do not have ${chalk.bold("the server folder")}. Version check skipped for ${chalk.bold("the server folder")}.`));
        } else {
            console.log(chalk.yellowBright(`You are running an outdated version of Kaspa Node Monitor on ${chalk.bold("the server folder")} (${packageJsonServer.version}). The latest version is ${latestVersion}.`));
        }
        // Check for package.json in the client folder
        if (latestVersion === versions.client) {
            console.log(chalk.greenBright(`You are running the latest version of Kaspa Node Monitor on ${chalk.bold("the client folder")} (${latestVersion})`));
        } else if (versions.client === '') {
            console.log(chalk.yellowBright(`It appears that you do not have ${chalk.bold("the client folder")}. Version check skipped for ${chalk.bold("the client folder")}.`));
        } else {
            console.log(chalk.yellowBright(`You are running an outdated version of Kaspa Node Monitor on ${chalk.bold("the client folder")} (${packageJsonClient.version}). The latest version is ${latestVersion}.`));
        }
    }
}
