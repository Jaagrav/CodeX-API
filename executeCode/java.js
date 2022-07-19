const executeJava = async (codeFile, inputs, timeout = 8, ws) => {
  const runCode = require('./run_code');
  return await runCode(codeFile, inputs, {
    command: 'java',
    args: [
      '-Dfile.encoding=UTF-8',
    ],
    timeout,
    language: 'java',
    version: '11.0.15',
    needCompile: false,
    ws,
  });
};

module.exports = {
  executeJava,
};
