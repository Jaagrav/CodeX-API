const { spawn, exec } = require("child_process"),
  path = require("path");

// exec(`_SILENT_JAVA_OPTIONS="$_JAVA_OPTIONS"`);
// exec(`unset _JAVA_OPTIONS`);
// exec(`alias java='java "$_SILENT_JAVA_OPTIONS"'`);

const runCode = async (codeFile, inputs) => {
  const timeout = 8;
  try {
    const output = await new Promise((resolve, reject) => {
      const codeExec = spawn("java", [
        "-Dfile.encoding=UTF-8",
        `${path.join(__dirname, `../codes/${codeFile}`)}`,
      ]);
      let outputString = "",
        errorString = "";

      if (inputs) {
        codeExec.stdin.write(inputs);
        codeExec.stdin.end();
      }

      codeExec.stdout.on("data", (data) => {
        outputString += data.toString();
      });
      codeExec.stderr.on("data", (data) => {
        errorString += data.toString();
      });
      codeExec.on("exit", () => {
        if (errorString && !outputString) reject(errorString);
        resolve(outputString);
      });

      setTimeout(() => {
        reject(
          `Error: Timed Out. Your code took too long to execute, over ${timeout} seconds.`
        );
      }, timeout * 1000);
    });

    return {
      success: true,
      timestamp: new Date(),
      output,
      language: "java",
      version: "11.0.15",
    };
  } catch (error) {
    return {
      success: false,
      timestamp: new Date(),
      error,
      language: "java",
      version: "11.0.15",
    };
  }
};

const executeJava = async (codeFile, inputs) => {
  return await runCode(codeFile, inputs);
};

module.exports = {
  executeJava,
};
