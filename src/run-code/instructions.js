const {join} = require('path')

const CODES_DIR = process.env.CODES_DIR || "/tmp/codes";
const OUTPUTS_DIR = process.env.OUTPUTS_DIR || "/tmp/outputs";

const commandMap = (jobID, language) => {
    switch (language) {
        case 'java':
            return {
                executeCodeCommand: 'java',
                executionArgs: [
                    join(process.cwd(), `${CODES_DIR}/${jobID}.java`)
                ],
                compilerInfoCommand: 'java --version'
            };
        case 'cpp':
            return {
                compileCodeCommand: 'g++',
                compilationArgs: [
                    join(process.cwd(), `${CODES_DIR}/${jobID}.cpp`),
                    '-o',
                    join(process.cwd(), `${OUTPUTS_DIR}/${jobID}.out`)
                ],
                executeCodeCommand: join(process.cwd(), `outputs/${jobID}.out`),
                outputExt: 'out',
                compilerInfoCommand: 'g++ --version'
            };
        case 'py':
            return {
                executeCodeCommand: 'python3',
                executionArgs: [
                    join(process.cwd(), `${CODES_DIR}/${jobID}.py`)
                ],
                compilerInfoCommand: 'python3 --version'
            }
        case 'c':
            return {
                compileCodeCommand: 'gcc',
                compilationArgs: [
                    join(process.cwd(), `${CODES_DIR}/${jobID}.c`),
                    '-o',
                    join(process.cwd(), `${OUTPUTS_DIR}/${jobID}.out`)
                ],
                executeCodeCommand: join(process.cwd(), `outputs/${jobID}.out`),
                outputExt: 'out',
                compilerInfoCommand: 'gcc --version'
            }
        case 'js':
            return {
                executeCodeCommand: 'node',
                executionArgs: [
                    join(process.cwd(), `${CODES_DIR}/${jobID}.js`)
                ],
                compilerInfoCommand: 'node --version'
            }
        case 'go':
            return {
                executeCodeCommand: 'go',
                executionArgs: [
                    'run',
                    join(process.cwd(), `${CODES_DIR}/${jobID}.go`)
                ],
                compilerInfoCommand: 'go version'
            }
        case 'cs':
            return {
                compileCodeCommand: 'mcs',
                compilationArgs: [
                    `-out:${join(
                        process.cwd(),
                        `outputs/${jobID}`
                    )}.exe`,
                    `${join(process.cwd(), `${CODES_DIR}/${jobID}.cs`)}`,
                ],
                executeCodeCommand: 'mono',
                executionArgs: [
                    `${join(process.cwd(), `${OUTPUTS_DIR}/${jobID}`)}.exe`
                ],
                outputExt: 'exe',
                compilerInfoCommand: 'mcs --version'
            }
    }
}

const supportedLanguages = ['java', 'cpp', 'py', 'c', 'js', 'go', 'cs'];

module.exports = {commandMap, supportedLanguages}
