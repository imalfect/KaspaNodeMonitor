import inquirer from "inquirer";
import chalk from "chalk";
import AdmZip from "adm-zip";
import fs from "fs-extra";
import {execa} from "execa";
import fetch from "node-fetch";
import ora from "ora";
import cliSpinners from "cli-spinners";
export const themesList = {
    themes: ['mainDark','mainLight','commandLineGreen','commandLineYellow']
}
export default class InitCommand {
    static command = 'init';
    static description = 'Create a new kaspa node monitor instance';

    static async action() {
        console.log(chalk(`Welcome to ${chalk.bold("KMonInit")}!`));
        console.log(chalk(`This tool will guide you through the process of setting up ${chalk.green('Kaspa Node Monitor.')}`));
        console.log('Let\'s get started by asking you a few questions.');
        // Ask the user for the node's RPC address, also give option to select default 127.0.0.1:16110
        let nodeUrl = await inquirer.prompt([
            {
                type: 'input',
                name: 'nodeUrl',
                message: 'What is the RPC address of your node?',
                default: '127.0.0.1:16200',
            }
        ]);
        // Ask the user whether to allow server information or not
        let allowServerInfo = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'allowServerInfo',
                message: 'Do you want to allow server information, such as CPU model, RAM, etc?',
            }
        ]);
        // Ask the user for log level
        let logLevel = await inquirer.prompt([
            {
                type: 'list',
                name: 'logLevel',
                message: 'What log level do you want to use? You can find them explained more detailed in our GitHub Repo.',
                choices: [
                    'trace',
                    'debug',
                    'info',
                    'warn',
                    'error'
                ]
            }
        ]);
        // Ask the user for the port to run the server on
        let port = await inquirer.prompt([
            {
                type: 'input',
                name: 'port',
                message: 'What port do you want to run the server on?',
                default: '3000',
            }
        ]);
        // Ask the user for the host to run the server on, make it a list with 127.0.0.1 and 0.0.0.0
        let host = await inquirer.prompt([
            {
                type: 'list',
                name: 'host',
                message: 'What host do you want to run the server on? (Hint: 127.0.0.1 for a local server, and 0.0.0.0 for a public server)',
                choices: [
                    '127.0.0.1',
                    '0.0.0.0',
                    'Something else'
                ]
            }
        ]);
        // Ask whether to serve the frontend along with the express server or not
        let serveFrontend = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'serveFrontend',
                message: 'Do you want to serve the frontend along with the backend server?'
            }
        ]);
        // Ask the user for the location of the node
        let location = await inquirer.prompt([
            {
                type: 'input',
                name: 'location',
                message: 'What is the location of your node? (Hint: City, Country)',
                default: 'Kasland',
            }
        ]);
        console.log(chalk.green('Thank you for answering all the questions about the backend, let\'s move on to the frontend.'));
        // Ask the user for the welcome text of the website
        let title = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What do you want the welcome message of the website to be?',
                default: 'Welcome to Jake\'s Node!',
            }
        ]);
        // Ask for the WS url of the backend
        if (host.host === '127.0.0.1') {
            console.log(chalk.green(`Since you chose to run the server locally, you can use ${chalk.bold(`ws://127.0.0.1:${port.port}`)} as the WS URL.`));
        }
        let wsUrl = await inquirer.prompt([
            {
                type: 'input',
                name: 'wsUrl',
                message: `What is the WS URL of the backend server? HINT: You can use a domain, if you're running the server globally, it should be your server public ip along with the port. Example: ws://4.3.2.1:${port.port}\n`,
            }
        ]);
        // Ask the user for the theme
        let theme = await inquirer.prompt([
            {
                type: 'list',
                name: 'theme',
                message: 'What theme do you want to use?',
                choices: themesList.themes,
            }
        ]);
        // Now turn the jsons into variables
        nodeUrl = nodeUrl.nodeUrl;
        allowServerInfo = allowServerInfo.allowServerInfo;
        logLevel = logLevel.logLevel;
        port = port.port;
        host = host.host;
        serveFrontend = serveFrontend.serveFrontend;
        location = location.location;
        title = title.title;
        wsUrl = wsUrl.wsUrl;

        if (!wsUrl.endsWith('/ws')) {
            if (!wsUrl.endsWith('/')) {
                wsUrl = wsUrl + '/ws';
            } else {
                wsUrl = wsUrl + 'ws';
            }
        }
        theme = theme.theme;

        // Log all answers just like before but stringify the answers
        console.log(chalk.green('Thank you for answering all the questions!'));
        const downloadSpinner = ora({
            text: 'Downloading the latest release...',
            spinner: cliSpinners.bouncingBar
        }).start();

        const response = await fetch('https://api.github.com/repos/imalfect/KaspaNodeMonitor/releases/latest');
        if (!response.ok) {
            downloadSpinner.stop();
            throw new Error(`Failed to fetch latest release: ${response.status} ${response.statusText}`);
        }
        const latestRelease = await response.json();
        // Download the latest release
        const downloadUrl = latestRelease.zipball_url
        const downloadResponse = await fetch(downloadUrl);
        if (!downloadResponse.ok) {
            downloadSpinner.stop();
            throw new Error(`Failed to download release: ${downloadResponse.status} ${downloadResponse.statusText}`);
        }
        const downloadBuffer = await downloadResponse.buffer();

        // Extract the zip
        const zip = new AdmZip(downloadBuffer);
        zip.extractAllTo('./code', true);
        // Move to the extracted folder, get the imalfect-KaspaNodeMonitor-xxxx
        const extractedFolder = fs.readdirSync('./code')[0];
        downloadSpinner.stop();
        console.log(chalk.green('Latest release downloaded and extracted successfully.'));
        // Create the config file
        const configJson = {
            "welcomeText": title,
            "wsApiURL": wsUrl,
            "theme": theme,
        }
        fs.writeFileSync('./code/' + extractedFolder + '/client/config.json', JSON.stringify(configJson, null, 4));
        // Write the .env file
        fs.writeFileSync('./code/' + extractedFolder + '/server/.env', `
    # Node URL
# This is the URL of the node you want to monitor, specify the IP and gRPC port
NODE_URL=${nodeUrl}

# Allow Server Information
# SUMMARY: This setting allows the server to send information about itself to the client.
# TODO: Let user manually set the specification in case the node monitor is running on a different machine.
ALLOW_SERVER_INFORMATION=${allowServerInfo}

# Node location (preferably country) 
NODE_LOCATION=${location}

# LOG LEVELS
# trace -> issues that are not errors but are useful to debug, not used for now
# debug -> Performance info and other useful information such as what files are being loaded and all the http + ws requests
# info -> Informational messages, default setting
# warn -> Warnings
# error -> Errors
LOG_LEVEL=${logLevel}

# PORT
# The port that the server will listen on
PORT=${port}

# HOST
# Host that the server will use (HINT: use 127.0.0.1 for local and 0.0.0.0 for public)
# DEFAULT is 127.0.0.1
HOST=${host}

# Serve Frontend
# If you want to serve the frontend with the server, set this to true
SERVE_FRONTEND=${serveFrontend}
`);
        console.log(chalk.green('Config file created successfully.'));

        // Install the dependencies for both server and client
        const installSpinner = ora({
            text: 'Installing dependencies...',
            spinner: cliSpinners.bouncingBar
        }).start();
        // Install the server dependencies
        await execa('npm', ['install'], {
            cwd: './code/' + extractedFolder + '/server'
        })
        // Install the client dependencies
        await execa('npm', ['install'], {
            cwd: './code/' + extractedFolder + '/client'
        });
        installSpinner.stop();
        console.log(chalk.green('Dependencies installed successfully.'));
        // Build the client
        const buildSpinner = ora({
            text: 'Building the client...',
            spinner: cliSpinners.bouncingBar
        }).start();
        await execa('npm', ['run', 'build'], {
            cwd: './code/' + extractedFolder + '/client'
        });
        buildSpinner.stop();
        console.log(chalk.green('Client built successfully.'));
        // Create new folder called "final"
        fs.mkdirSync('./out');
        // Copy the server folder to the final folder
        fs.copySync('./code/' + extractedFolder + '/server', './out/server');
        // Copy the client/dist folder to the final folder
        fs.copySync('./code/' + extractedFolder + '/client/', './out/client/');
        // Copy package.json from extractedfolder to final folder
        fs.copySync('./code/' + extractedFolder + '/package.json', './out/package.json');
        // Delete the code folder
        fs.rm('./code', { recursive: true });

        console.log(chalk.green('Done, Check the out folder for the final product.'));
    }
}
