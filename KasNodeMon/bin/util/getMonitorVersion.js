import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

export default async function getMonitorVersion(dir) {
    let versions = {
        main: '',
        server: '',
        client: ''
    }
    const packageJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    if (!(packageJson.name === 'kaspanodemonitor')) {
        throw new Error(chalk.redBright('No Kaspa Node Monitor instance found in this directory. Make sure you are in the main folder of the Kaspa Node Monitor instance, not the client or server folder.'));
    } else {
        versions.main = packageJson.version;
    }
    // Check for package.json in the server folder
    const packageJsonServer = JSON.parse(fs.readFileSync(path.join(dir, 'server', 'package.json'), 'utf8'));
    if (!(packageJsonServer.name === 'kaspanodemonitorbackend')) {
        console.error(chalk.redBright(`No kaspa monitor server found in ${chalk.bold("the server folder")}. Skipping server version check.`));
    } else {
        versions.server = packageJsonServer.version;
    }
    // Check for package.json in the client folder
    const packageJsonClient = JSON.parse(fs.readFileSync(path.join(dir, 'client', 'package.json'), 'utf8'));
    if (!(packageJsonClient.name === 'kaspanodemonitorfrontend')) {
        console.error(chalk.redBright(`No kaspa monitor client found in ${chalk.bold("the client folder")}. Skipping client version check.`));
    } else {
        versions.client = packageJsonClient.version;
    }
    return versions;
}
