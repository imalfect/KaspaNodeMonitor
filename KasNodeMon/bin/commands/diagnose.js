import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import chalk from "chalk";
import kaspa from 'kaspajs';
import {themesList} from "./init.js";
export default class DiagnoseCommand {
    static command = 'diagnose';
    static description = 'Diagnose the kaspa node monitor instance for potential issues';
    static options = [
        {
            flags: '-d, --dir <dir>',
            description: 'Directory of Kaspa Node Monitor instance, main folder',
            default: process.cwd()
        }
    ];
    static action(dir) {
        dir = dir.dir;
        // Check if the directory has a package json file
        const packageJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
        if (!(packageJson.name === 'kaspanodemonitor')) {
            console.log(chalk.redBright('No Kaspa Node Monitor instance found in this directory'));
            return;
        }
        // Check if the server directory has a package json file
        const packageJsonServer = JSON.parse(fs.readFileSync(path.join(dir, 'server', 'package.json'), 'utf8'));
        if (!(packageJsonServer.name === 'kaspanodemonitorbackend')) {
            console.log(chalk.redBright('No Kaspa Node Monitor server instance found in this directory'));
            return;
        }
        // Check if the client directory has a package json file
        const packageJsonClient = JSON.parse(fs.readFileSync(path.join(dir, 'client', 'package.json'), 'utf8'));
        if (!(packageJsonClient.name === 'kaspanodemonitorfrontend')) {
            console.log(chalk.redBright('No Kaspa Node Monitor client instance found in this directory'));
            return;
        }
        // Check if the server directory has a .env file
        if (!fs.existsSync(path.join(dir, 'server', '.env'))) {
            console.log(chalk.redBright('No .env file found in the server directory'));
            return;
        }
        // Check if the client directory has a config.json file
        if (!fs.existsSync(path.join(dir, 'client', 'config.json'))) {
            console.log(chalk.redBright('No config.json file found in the client directory'));
            return;
        }
        const serverEnv = dotenv.parse(fs.readFileSync(path.join(dir, 'server', '.env')));
        const clientConfig = JSON.parse(fs.readFileSync(path.join(dir, 'client', 'config.json'), 'utf8'));
        let installationType;
        // Check if the server .env file has the correct variables
        if (serverEnv.SERVE_FRONTEND !== 'true') {
            console.log(chalk.yellowBright(chalk.bold('The .env file in the server is configured to not serve the frontend, this means that the frontend will not be served when the server is started. If you want to serve the frontend, set the SERVE_FRONTEND variable to true in the .env file in the server directory.')));
        }
        if (serverEnv.HOST === '127.0.0.1') {
            console.log(chalk.yellowBright(chalk.bold('The .env file in the server is configured to work only on localhost, this means that the the server will only be accessible from the same machine.')));
            installationType = 'local';
        }
        if (serverEnv.HOST.startsWith('192.168')) {
            console.log(chalk.yellowBright(chalk.bold('The .env file in the server is configured to work only on the local network, this means that the the server will only be accessible from the same network. If you want to make the server accessible from the internet, set the HOST variable to 0.0.0.0')));
            installationType = 'localnet';
        }
        if (serverEnv.HOST === '0.0.0.0') {
            console.log(chalk.greenBright(chalk.bold('The .env file in the server is configured to work on the internet, make sure that the port you are using is open in your firewall.')));
            installationType = 'global';
        }
        // Check node connection
        console.log(chalk.bold('Checking node connection...'));
        let rpc = new kaspa.Daemon(serverEnv.NODE_URL, () => {
            console.log(`${chalk.green('Kaspa:')} Connected to ${nodeUrl}`);
            checkConnection();
        }).on('error', (err) => {
            // This is a workaround for a bug in kaspajs
            console.error(`${chalk.red('Kaspa:')} ${err}`);
        });
        // Check if the client config.json file has the correct variables
        if (themesList.themes.indexOf(clientConfig.theme) === -1) {
            console.log(chalk.yellowBright(chalk.bold(`The theme ${clientConfig.theme} is not a valid theme, This may cause the frontend to not display properly. Please choose a valid theme from the following list: ${themesList.themes.join(', ')}`)));
        }
        if ((clientConfig.wsApiURL.contains('localhost') || clientConfig.wsApiURL.contains('127.0.0.1')) && installationType !== 'local') {
            console.log(chalk.yellowBright(chalk.bold(`The wsApiURL in the config.json file is configured to work only on localhost, while the server has a different setting this may cause connection issues. If you want to make the frontend accessible from the internet, change the wsApiURL variable.`)));
        }
        if (clientConfig.wsApiURL.contains('192.168') && installationType !== 'localnet') {
            console.log(chalk.yellowBright(chalk.bold(`The wsApiURL in the config.json file is configured to work only on the local network, while the server has a different setting this may cause connection issues. If you want to make the frontend accessible from the internet, change the wsApiURL variable.`)));
        }
        if ((clientConfig.wsApiURL.contains('192.168')
            || clientConfig.wsApiURL.contains('localhost')
            || clientConfig.wsApiURL.contains('127.0.0.1'))
            && installationType !== 'global') {
            console.log(chalk.yellowBright(chalk.bold(`The wsApiURL in the config.json file is configured to work only on the local network, while the server has a different setting this may cause connection issues. If you want to make the frontend accessible from the internet, change the wsApiURL variable.`)));
        }


    }
}

async function checkConnection() {
    try {
        const info = await rpc.request('getInfoRequest', {});
        console.log(`${chalk.green('Kaspa:')} Connected to ${nodeUrl} running Kaspad version ${info.serverVersion}`);
    } catch (e) {
        console.log(e, 'error');
    }
}
