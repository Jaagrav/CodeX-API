const {join} = require('path')

const CODES_DIR = process.env.CODES_DIR || "/tmp/codes";
const OUTPUTS_DIR = process.env.OUTPUTS_DIR || "/tmp/outputs";

const commandMap = (jobID, language) => {
    switch (language) {
        case 'java':
            return {
                executeCodeCommand: 'java',
                executionArgs: [
                    `${CODES_DIR}/${jobID}.java`
                ],
                compilerInfoCommand: 'java --version'
            };
        case 'cpp':
            return {
                compileCodeCommand: 'g++',
                compilationArgs: [
                    `${CODES_DIR}/${jobID}.cpp`,
                    '-o',
                    `${OUTPUTS_DIR}/${jobID}.out`
                ],
                executeCodeCommand: `${OUTPUTS_DIR}/${jobID}.out`,
                outputExt: 'out',
                compilerInfoCommand: 'g++ --version'
            };
        case 'py':
            return {
                executeCodeCommand: 'python3',
                executionArgs: [
                    `${CODES_DIR}/${jobID}.py`
                ],
                compilerInfoCommand: 'python3 --version'
            }
        case 'c':
            return {
                compileCodeCommand: 'gcc',
                compilationArgs: [
                    `${CODES_DIR}/${jobID}.c`,
                    '-o',
                    `${OUTPUTS_DIR}/${jobID}.out`
                ],
                executeCodeCommand: `${OUTPUTS_DIR}/${jobID}.out`,
                outputExt: 'out',
                compilerInfoCommand: 'gcc --version'
            }
        case 'js':
            return {
                executeCodeCommand: 'node',
                executionArgs: [
                    `${CODES_DIR}/${jobID}.js`
                ],
                compilerInfoCommand: 'node --version'
            }
        case 'go':
            return {
                executeCodeCommand: 'go',
                executionArgs: [
                    'run',
                    `${CODES_DIR}/${jobID}.go`
                ],
                compilerInfoCommand: 'go version'
            }
        case 'cs':
            return {
                compileCodeCommand: 'mcs',
                compilationArgs: [
                    `-out:${OUTPUTS_DIR}/${jobID}.exe`,
                    `${CODES_DIR}/${jobID}.cs`,
                ],
                executeCodeCommand: 'mono',
                executionArgs: [
                    `${OUTPUTS_DIR}/${jobID}.exe`
                ],
                outputExt: 'exe',
                compilerInfoCommand: 'mcs --version'
            }
    }
}

const supportedLanguages = ['java', 'cpp', 'py', 'c', 'js', 'go', 'cs'];

module.exports = {commandMap, supportedLanguages}
