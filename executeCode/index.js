const { executeJava } = require("./java.js");
const { executePython } = require("./python.js");
const { executeCorCPP } = require("./c_or_cpp.js");

module.exports = {
  executeJava,
  executePython,
  executeCorCPP,
};
