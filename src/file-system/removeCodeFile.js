const { unlinkSync } = require("fs");
const { join } = require("path");

const CODES_DIR = process.env.CODES_DIR || "/tmp/codes";
const OUTPUTS_DIR = process.env.OUTPUTS_DIR || "/tmp/outputs";

const removeCodeFile = async (uuid, lang, outputExt) => {
    const codeFile = join(CODES_DIR, `${uuid}.${lang}`);
    const outputFile = join(OUTPUTS_DIR, `${uuid}.${outputExt}`);

    try {
        unlinkSync(codeFile);
    } catch (err) {
        console.error(`Failed to delete code file: ${codeFile}`, err);
    }

    if (outputExt) {
        try {
            unlinkSync(outputFile);
        } catch (err) {
            console.error(`Failed to delete output file: ${outputFile}`, err);
        }
    }

    if (lang === 'pas') {
        const objectFile = join(OUTPUTS_DIR, `${uuid}.o`);
        try {
            if (require("fs").existsSync(objectFile)) {
                unlinkSync(objectFile);
            }
        } catch (err) {
            console.error(`Failed to delete object file: ${objectFile}`, err);
        }
    }
};

module.exports = {
    removeCodeFile,
};
