export default class HelloCommand {
    static command = 'hello <name>';
    static description = 'Say hello to someone';

    static action(name) {
        console.log(`Hello, ${name}!`);
    }
}
