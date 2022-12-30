const {join} = require('path')

const commandMap = (jobID, language) => {
    switch (language) {
        case 'java':
            return {
                executeCodeCommand: 'java',
                executionArgs: [
                    '-Dfile.encoding=UTF-8',
                    join(process.cwd(), `codes/${jobID}.java`)
                ],
                compilerInfoCommand: 'java --version'
            };
        case 'cpp':
            return {
                compileCodeCommand: 'g++',
                compilationArgs: [
                    join(process.cwd(), `codes/${jobID}.cpp`),
                    '-o',
                    join(process.cwd(), `outputs/${jobID}.out`)
                ],
                executeCodeCommand: join(process.cwd(), `outputs/${jobID}.out`),
                outputExt: 'out',
                compilerInfoCommand: 'g++ --version'
            };
        case 'py':
            return {
                executeCodeCommand: 'python3',
                executionArgs: [
                    join(process.cwd(), `codes/${jobID}.py`)
                ],
                compilerInfoCommand: 'python3 --version'
            }
        case 'c':
            return {
                compileCodeCommand: 'gcc',
                compilationArgs: [
                    join(process.cwd(), `codes/${jobID}.c`),
                    '-o',
                    join(process.cwd(), `outputs/${jobID}.out`)
                ],
                executeCodeCommand: join(process.cwd(), `outputs/${jobID}.out`),
                outputExt: 'out',
                compilerInfoCommand: 'gcc --version'
            }
        case 'js':
            return {
                executeCodeCommand: 'node',
                executionArgs: [
                    join(process.cwd(), `codes/${jobID}.js`)
                ],
                compilerInfoCommand: 'node --version'
            }
        case 'go':
            return {
                executeCodeCommand: 'go',
                executionArgs: [
                    'run',
                    join(process.cwd(), `codes/${jobID}.go`)
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
                    `${join(process.cwd(), `codes/${jobID}.cs`)}`,
                ],
                executeCodeCommand: 'mono',
                executionArgs: [
                    `${join(process.cwd(), `outputs/${jobID}`)}.exe`
                ],
                outputExt: 'exe',
                compilerInfoCommand: 'mcs --version'
            }
    }
}

const supportedLanguages = ['java', 'cpp', 'py', 'c', 'js', 'go', 'cs'];

module.exports = {commandMap, supportedLanguages}