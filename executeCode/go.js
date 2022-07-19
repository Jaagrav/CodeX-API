const executeGo = async (codeFile, inputs, timeout = 8, ws) => {
  const runCode = require('./run_code');
  return await runCode(codeFile, inputs, {
    command: 'go',
    args: [
      'run',
    ],
    timeout,
    language: 'go',
    version: '1.18.3',
    needCompile: false,
    ws,
  });
};

module.exports = {
  executeGo,
};
