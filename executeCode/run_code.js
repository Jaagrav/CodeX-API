const { spawn } = require("child_process"),
  path = require("path");

function execCommand(command, args, inputs, timeout = 8) {
  return new Promise((resolve) => {
    const runCommand = spawn(command, args);
    let output = '',
      error = '';

    const timer = setTimeout(() => {
      error = `Error: Timed Out. Your code took too long to execute, over ${timeout} seconds.`
      runCommand.kill("SIGHUP");
    }, timeout * 1000);

    if(inputs) {
      if(typeof inputs === 'string') inputs = [inputs];
      inputs.forEach((input) => {
        runCommand.stdin.write(`${input}\n`);
      });
      runCommand.stdin.end();
    }

    runCommand.stdin.on('error', (...args) => {
      console.log('stdin err', args);
    });

    runCommand.stdout.on('data', (data) => {
      output += data.toString();
    });

    runCommand.stderr.on('data', (data) => {
      error += data.toString();
    });

    runCommand.on('exit', () => {
      clearTimeout(timer);
      resolve({output, error});
    });
  });
}

module.exports = async (codeFile, inputs, {command, args = [], timeout = 8, language, version, needCompile, runCommand}) => {
  let result = await execCommand(command, [
      ...args,
      `${path.join(__dirname, `../codes/${codeFile}`)}`,
    ],
    needCompile?null:inputs,
    timeout);

  if(needCompile && !result.error) {
    if(runCommand) {
      result = await execCommand(
        runCommand,
        [`${path.join(
          __dirname,
          `../classes/${codeFile.split(".")[0]}`
        )}.out`],
        inputs,
        timeout,
      );
    } else {
      result = await execCommand(
        `${path.join(
          __dirname,
          `../classes/${codeFile.split(".")[0]}`
        )}.out`,
        [],
        inputs,
        timeout,
      );
    }
  }

  return {
    success: result.error === '',
    timestamp: new Date(),
    ...result,
    language,
    version,
  };
};