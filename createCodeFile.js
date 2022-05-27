const { v4: getUUID } = require("uuid"),
  fs = require("fs"),
  path = require("path");

if (!fs.existsSync(path.join(__dirname, "codes")))
  fs.mkdirSync(path.join(__dirname, "codes"));

const createCodeFile = (language, code) => {
  const jobID = getUUID(),
    fileName = `${jobID}.${language}`;

  fs.writeFileSync(path.join(__dirname, `codes/${fileName}`), code.toString());

  return fileName;
};

module.exports = {
  createCodeFile,
};
