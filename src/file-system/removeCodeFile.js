const {unlinkSync} = require("fs"),
    {join} = require("path");

const removeCodeFile = async (uuid, lang, outputExt) => {
    const codeFile = join(process.cwd(), `codes/${uuid}.${lang}`),
        outputFile = join(process.cwd(), `outputs/${uuid}.${outputExt}`);

    await unlinkSync(codeFile);

    if (outputExt)
        await unlinkSync(outputFile);
};

module.exports = {
    removeCodeFile,
};
