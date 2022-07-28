const { executeJava } = require('./java.js');
const { executePython } = require('./python.js');
const { executeC } = require('./c.js');
const { executeCPP } = require('./cpp.js');
const { executeJavaScript } = require('./javascript.js');
const { executeGo } = require('./go.js');
const { executeCsharp } = require('./csharp.js')

module.exports = {
  executeJava,
  executePython,
  executeC,
  executeCPP,
  executeJavaScript,
  executeGo,
  executeCsharp
};
