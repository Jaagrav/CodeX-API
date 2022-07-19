const executePython = async (codeFile, inputs, timeout = 8, ws) => {
  const runCode = require('./run_code');
  return await runCode(codeFile, inputs, {
    command: 'python3',
    args: [],
    timeout,
    language: 'py',
    version: '3.10.4',
    needCompile: false,
    ws,
  });
};

module.exports = {
  executePython,
};
