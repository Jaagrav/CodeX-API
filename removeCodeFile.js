const fs = require("fs"),
  path = require("path");

const removeCodeFile = (uuid, lang) => {
  const codeFile = path.join(__dirname, `codes/${uuid}.${lang}`),
    classFile = path.join(__dirname, `classes/${uuid}.out`);

  try {
    fs.unlinkSync(codeFile);
    //file removed
  } catch (err) {
    // console.error(err);
  }

  try {
    fs.unlinkSync(classFile);
    //file removed
  } catch (err) {
    // console.error(err);
  }
};

module.exports = {
  removeCodeFile,
};
