import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import inquirer from "inquirer";
import {execa} from "execa";
import ora from "ora";
import cliSpinners from "cli-spinners";
const themesList = {
    themes: ['mainDark','mainLight','commandLineGreen','commandLineYellow']
}
export default class ConfigCommand {
    static command = 'config <type>';
    static description = 'Change the configuration of a kaspa node monitor instance';
    // noinspection XmlDeprecatedElement
    static options = [
        {
            flags: '-d, --dir <dir>',
            description: 'Directory of kaspa node monitor instance',
            default: process.cwd()
        }
    ];
    static async action(type, dir) {
        dir = dir.dir;
        // Read package.json and check if kaspa node monitor is installed in that dir
        const packageJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
        console.log(packageJson)
        if (!(packageJson.name === 'kaspanodemonitor')) {
            console.log(chalk.redBright('No kaspa node monitor instance found in this directory'));
            return;
        }
        if (type === 'client') {
            console.log('Client config');
            configureClient(dir)
        } else if (type === 'server') {
            console.log('Server config');
            configureServer(dir)
        } else {
            console.log(chalk.redBright('Invalid config type'));
        }
    }
}
async function configureClient(dir) {
    const clientDir = fs.readdirSync(path.join(dir, 'client'));
    if (!clientDir.includes('config.json')) {
        console.log(chalk.redBright('config.json file not found'));
        return;
    }
    // Read config.json file
    const configJson = JSON.parse(fs.readFileSync(path.join(dir, 'client', 'config.json'), 'utf8'));
    // Print out current config
    console.log(chalk.blueBright('---- Current config ----'));
    console.log(chalk.greenBright('Welcome text: ') + configJson.welcomeText);
    console.log(chalk.greenBright('Websocket API URL: ') + configJson.wsApiURL);
    console.log(chalk.greenBright('Theme: ') + configJson.theme);
    console.log(chalk.blueBright("You will now be asked to enter the new config values. Press enter to keep the current value."))
    const questions = [
        {
            type: 'input',
            name: 'welcomeText',
            message: 'Welcome text',
            default: configJson.welcomeText
        },
        {
            type: 'input',
            name: 'wsApiURL',
            message: 'Websocket API URL',
            default: configJson.wsApiURL
        },
        {
            type: 'list',
            name: 'theme',
            message: 'Theme',
            choices: themesList.themes,
        }
    ];
    const answers = await inquirer.prompt(questions);
    // Write new config to config.json
    fs.writeFileSync(path.join(dir, 'client', 'config.json'), JSON.stringify(answers, null, 4));
    console.log(chalk.greenBright('Config updated successfully.'));
    const spinner = ora({
        text: 'Rebuilding the client',
        spinner: cliSpinners.bouncingBar
    }).start();
    await execa('npm', ['run', 'build'], {cwd: path.join(dir, 'client')});
    spinner.stop();
    console.log(chalk.greenBright('Client rebuilt successfully. This operation was a success!'));

}
async function configureServer(dir) {
    // Read server dir and check if .env exists
    const serverDir = fs.readdirSync(path.join(dir, 'server'));
    if (!serverDir.includes('.env')) {
        console.log(chalk.redBright('.env file not found'));
        return;
    }
    // Read .env file
    const envFile = fs.readFileSync(path.join(dir, 'server', '.env'), 'utf8');
    // Parse .env file
    const envConfig = dotenv.parse(envFile);
    // Print out current config
    console.log(chalk.blueBright('---- Current config ----'));
    console.log(chalk.greenBright('Node URL: ') + envConfig.NODE_URL);
    console.log(chalk.greenBright('Allow server information: ') + envConfig.ALLOW_SERVER_INFORMATION);
    console.log(chalk.greenBright('Node location: ') + envConfig.NODE_LOCATION);
    console.log(chalk.greenBright("Track node size: ") + envConfig.TRACK_NODE_SIZE);
    console.log(chalk.greenBright("Datadir:") + envConfig.DATA_FOLDER);
    console.log(chalk.greenBright('Log level: ') + envConfig.LOG_LEVEL);
    console.log(chalk.greenBright('Port: ') + envConfig.PORT);
    console.log(chalk.greenBright('Host: ') + envConfig.HOST);
    console.log(chalk.greenBright('Serve frontend: ') + envConfig.SERVE_FRONTEND);
    console.log(chalk.blueBright('---- Current config ----'));
    // Time to "rebuild" the config
    console.log(chalk.blueBright("You will now be asked to enter the new config values. Press enter to keep the current value."))
    const questions = [
        {
            type: 'input',
            name: 'nodeUrl',
            message: 'Node URL',
            default: envConfig.NODE_URL
        },
        {
            type: 'input',
            name: 'allowServerInfo',
            message: 'Allow server information',
            default: envConfig.ALLOW_SERVER_INFORMATION
        },
        {
            type: 'input',
            name: 'location',
            message: 'Node location',
            default: envConfig.NODE_LOCATION
        },
        {
            type: 'confirm',
            name: 'trackSize',
            message: 'Track node size',
            default: envConfig.TRACK_NODE_SIZE
        },
        {
            type: 'input',
            name: 'dataDir',
            message: 'Node data dir (for size tracking)',
            default: envConfig.DATA_FOLDER
        },
        {
            type: 'input',
            name: 'logLevel',
            message: 'Log level',
            default: envConfig.LOG_LEVEL
        },
        {
            type: 'input',
            name: 'port',
            message: 'Port',
            default: envConfig.PORT
        },
        {
            type: 'input',
            name: 'host',
            message: 'Host',
            default: envConfig.HOST
        },
        {
            type: 'input',
            name: 'serveFrontend',
            message: 'Serve frontend',
            default: envConfig.SERVE_FRONTEND
        }
    ];
    const answers = await inquirer.prompt(questions);
    // Write new config to .env file
    // TODO: Make this more efficient
    let newEnvFile = '';
    newEnvFile += `NODE_URL=${answers.nodeUrl}\n`;
    newEnvFile += `ALLOW_SERVER_INFORMATION=${answers.allowServerInfo}\n`;
    newEnvFile += `NODE_LOCATION=${answers.location}\n`;
    newEnvFile += `TRACK_NODE_SIZE=${answers.trackSize}\n`;
    newEnvFile += `DATA_FOLDER=${answers.dataDir}\n`;
    newEnvFile += `LOG_LEVEL=${answers.logLevel}\n`;
    newEnvFile += `PORT=${answers.port}\n`;
    newEnvFile += `HOST=${answers.host}\n`;
    newEnvFile += `SERVE_FRONTEND=${answers.serveFrontend}\n`;
    fs.writeFileSync(path.join(dir, 'server', '.env'), newEnvFile);
    console.log(chalk.greenBright('Config updated'));
}
