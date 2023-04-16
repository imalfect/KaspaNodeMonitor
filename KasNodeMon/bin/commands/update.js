import fs from 'fs-extra';
import * as path from 'path';
import {execa} from "execa";
import chalk from 'chalk';
import fetch from "node-fetch";
import admZip from 'adm-zip';
import ora from 'ora';
import inquirer from "inquirer";
import cliSpinners from 'cli-spinners';
import getMonitorVersion from "../util/getMonitorVersion.js";
export default class HelloCommand {
    static command = 'update';
    static description = 'Update a Kaspa Node Monitor instance';

    static options = [
        {
            flags: '-d, --dir <dir>',
            description: 'Directory of Kaspa Node Monitor instance, main folder',
            default: process.cwd()
        }
    ];

    static async action(dir) {
        dir = dir.dir
        // Check for package.json in the main folder
        const packageJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
        if (!(packageJson.name === 'kaspanodemonitor')) {
            console.log(chalk.redBright('No Kaspa Node Monitor instance found in this directory'));
            return;
        }
        // Check for package.json in the server folder
        const packageJsonServer = JSON.parse(fs.readFileSync(path.join(dir, 'server', 'package.json'), 'utf8'));
        if (!(packageJsonServer.name === 'kaspanodemonitorbackend')) {
            console.log(chalk.redBright('No Kaspa Node Monitor server instance found in this directory, cannot continue'));
            return;
        }
        // Check for package.json in the client folder
        const packageJsonClient = JSON.parse(fs.readFileSync(path.join(dir, 'client', 'package.json'), 'utf8'));
        let updateClient = true;
        if (!(packageJsonClient.name === 'kaspanodemonitorfrontend')) {
            console.log(chalk.redBright('No Kaspa Node Monitor client instance found in this directory.'));
            // Ask whether to continue
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'continue',
                    message: 'Do you want to continue without updating the client? This will update just the server, and may cause issues.',
                }
            ]).then(async (answers) => {
                if (answers.continue) {
                    updateClient = false;
                } else {
                    process.exit(0);
                }
            });
        }
        // Check current versions
        const versions = await getMonitorVersion(dir);
        console.log(chalk.greenBright(`
            --- Current versions --- \n
            Kaspa Node Monitor: ${versions.main}\n
            Kaspa Node Monitor Server: ${versions.server}\n
            Kaspa Node Monitor Client: ${versions.client}
        `));
        // Get the latest version
        const spinner = ora({
            text: 'Getting latest version from GitHub...',
            spinner: cliSpinners.bouncingBar
        }).start();
        // Check latest release version from GitHub
        const latestRelease = await fetch('https://api.github.com/repos/imalfect/KaspaNodeMonitor/releases/latest').then(res => res.json());
        spinner.stop();
        const latestVersion = latestRelease.tag_name;
        console.log(chalk.greenBright(`Latest version: ${latestVersion}`));
        // Check if the latest version is newer than the current version
        let isLatest = {
            main: false,
            server: false,
            client: false
        }
        if (versions.server === latestVersion) {
            console.log(chalk.greenBright('You are already running the latest version on the server folder'));
            isLatest.server = true;
        }
        if (versions.client === latestVersion) {
            console.log(chalk.greenBright('You are already running the latest version on the client folder'));
            isLatest.client = true;
        }
        if (versions.main === latestVersion) {
            console.log(chalk.greenBright('You are already running the latest version on the main folder'));
            isLatest.main = true;
        } else {
            console.log(chalk.yellowBright('You are not running the latest version on the main folder, this may cause issues. Both the server and client will be updated as well.'));
            isLatest.main = false;
            isLatest.server = false;
            isLatest.client = false;
        }
        if (isLatest.main && isLatest.server && isLatest.client) {
            console.log(chalk.greenBright('You are already running the latest version of Kaspa Node Monitor, there is no need to update!'));
            return;
        }
        // Inform the user that the update will start, ask for confirmation
        const updateApproval = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: `It appears that ${isLatest.main ? 'the main folder' : ''} ${isLatest.server ? 'the server folder' : ''} ${isLatest.client ? 'the client folder' : ''} ${isLatest.main && isLatest.server && isLatest.client ? 'are' : 'is'} not up to date. Do you want to continue with the update? Only the products that are not up to date will be updated. If you made any modifications to the code, they will be overwritten.`,
            }
        ]);
        if (!updateApproval.continue) {
            console.log(chalk.redBright('Update cancelled'));
            process.exit(0);
        }
        console.log(chalk.greenBright('Starting update...'));
        // Download the latest release
        const downloadSpinner = ora({
            text: 'Downloading latest release...',
            spinner: cliSpinners.bouncingBar
        }).start();
        const download = await fetch(latestRelease.zipball_url).then(res => res.buffer());
        downloadSpinner.stop();
        // Extract the zip file
        const extractSpinner = ora({
            text: 'Extracting files...',
            spinner: cliSpinners.bouncingBar
        }).start();
        // Extract the zip file into a temporary folder
        const zip = new admZip(download);
        const zipEntries = zip.getEntries();
        const tempDir = path.join(dir, 'temp');
        zip.extractAllTo(tempDir, true);
        // Find the folder name of the extracted files
        let extractedFolderName = '';
        for (let i = 0; i < zipEntries.length; i++) {
            if (zipEntries[i].entryName.endsWith('/')) {
                extractedFolderName = zipEntries[i].entryName;
                break;
            }
        }
        // Save the configs of the updated files
        const serverConfig = fs.readFileSync(path.join(dir, 'server', '.env'), 'utf8');
        const clientConfig = JSON.parse(fs.readFileSync(path.join(dir, 'client', 'config.json'), 'utf8'));
        // Delete old local files
        if (!isLatest.client) {
            fs.removeSync(path.join(dir, 'client'));
            fs.copySync(path.join(tempDir, extractedFolderName, 'client'), path.join(dir, 'client'));
        }
        if (!isLatest.server) {
            fs.removeSync(path.join(dir, 'server'));
            fs.copySync(path.join(tempDir, extractedFolderName, 'server'), path.join(dir, 'server'));
        }
        if (!isLatest.main) {
            fs.removeSync(path.join(dir, 'package.json'));
            fs.copySync(path.join(tempDir, extractedFolderName, 'package.json'), path.join(dir, 'package.json'));
        }
        // Write the configs back
        fs.writeFileSync(path.join(dir, 'server', '.env'), serverConfig);
        fs.writeFileSync(path.join(dir, 'client', 'config.json'), JSON.stringify(clientConfig));
        // Delete the temporary folder
        fs.removeSync(tempDir);
        extractSpinner.stop();
        // Install the new dependencies
        const installSpinner = ora({
            text: 'Installing dependencies...',
            spinner: cliSpinners.bouncingBar
        }).start();
        // Install the server dependencies
        if (!isLatest.server) {
            await execa('npm', ['install'], {
                cwd: path.join(dir, 'server')
            })
        }
        // Install the client dependencies
        if (!isLatest.client) {
            await execa('npm', ['install'], {
                cwd: path.join(dir, 'client')
            })
        }
        console.log(chalk.greenBright('Dependencies installed'));
        installSpinner.stop();
        // Build the client
        if (!isLatest.client) {
            const buildSpinner = ora({
                text: 'Building client...',
                spinner: cliSpinners.bouncingBar
            }).start();
            await execa('npm', ['run', 'build'], {
                cwd: path.join(dir, 'client')
            })
            console.log(chalk.greenBright('Client built'));
            buildSpinner.stop();
        }
    }
}
