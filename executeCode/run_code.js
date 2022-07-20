const { spawn } = require("child_process"),
  path = require("path");

function execCommand(command, args, inputs, timeout = 8, ws) {
  return new Promise((resolve) => {
    const runCommand = spawn(command, args);
    let output = '',
      error = '',
      timer;
    
    if(ws) {
      ws.send(JSON.stringify({type: 'ready'}));
    }

    if(timeout >= 0) {
      timer = setTimeout(() => {
        error = `Error: Timed Out. Your code took too long to execute, over ${timeout} seconds.`
        runCommand.kill("SIGHUP");
      }, timeout * 1000);
    }

    if(inputs) {
      if(typeof inputs === 'string') inputs = [inputs];
      inputs.forEach((input) => {
        runCommand.stdin.write(`${input}\n`);
      });
      runCommand.stdin.end();
    } else if(ws) {
      ws.on('message', function message(data) {
        data = JSON.parse(data);
        if(data && data.type === 'stdin') {
          const msg = data.message;
          if(msg === '') runCommand.stdin.end();
          else runCommand.stdin.write(`${msg}\n`);
        }
      });
    }

    runCommand.stdin.on('error', (...args) => {
      console.log('stdin err', args);
    });

    runCommand.stdout.on('data', (data) => {
      const msg = data.toString();
      output += msg;
      if(ws) {
        ws.send(JSON.stringify({type:'stdout', message: msg}));
      }
    });

    runCommand.stderr.on('data', (data) => {
      const msg = data.toString();
      error += msg;
      if(ws) {
        ws.send(JSON.stringify({type:'stderr', message: msg}));
      }
    });

    runCommand.on('exit', () => {
      if(timer != null) clearTimeout(timer);
      resolve({output, error});
    });
  });
}

module.exports = async (codeFile, inputs, {command, args = [], timeout = 8, language, version, needCompile, runCommand, ws}) => {
  let result = await execCommand(command, [
      ...args,
      `${path.join(__dirname, `../codes/${codeFile}`)}`,
    ],
    needCompile?null:inputs,
    timeout,
    needCompile?null:ws);

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
        ws,
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
        ws,
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