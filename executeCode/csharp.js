const path = require("path");

const executeCsharp = async (codeFile, inputs, timeout = 8) => {
  const runCode = require('./run_code');
  return await runCode(codeFile, inputs, {
    command: 'mcs',
    args: [
      `-out:${path.join(
        __dirname,
        `../classes/${codeFile.split(".")[0]}`
      )}.out`
    ],
    timeout,
    language: codeFile.split(".")[1],
    version: '11.2.0',
    needCompile: true,
    runCommand: 'mono',
  });
};

module.exports = {
  executeCsharp,
};
