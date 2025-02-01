const {commandMap} = require("./instructions")
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const info = async (language) => {
    const {compilerInfoCommand} = commandMap('', language);

    const {stdout} = await exec(compilerInfoCommand);

    return stdout;
}

module.exports = {info}