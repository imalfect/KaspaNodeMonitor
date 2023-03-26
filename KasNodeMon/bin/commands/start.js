export default class StartCommand {
    static command = 'start';
    static description = 'Say hello to someone';

    static action(name) {
        console.log(`Hello, ${name}!`);
    }
}
