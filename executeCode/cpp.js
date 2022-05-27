const { spawn, exec } = require("child_process"),
  path = require("path");

const runCode = async (codeFile, inputs) => {
  const timeout = 8;
  try {
    const output = await new Promise((resolve, reject) => {
      const codeCompile = spawn("g++", [
        "-o",
        `${path.join(__dirname, `../classes/${codeFile.split(".")[0]}`)}.out`,
        `${path.join(__dirname, `../codes/${codeFile}`)}`,
      ]);

      let outputString = "",
        errorString = "";

      codeCompile.stderr.on("data", (err) => {
        errorString += err.toString();
      });

      codeCompile.on("exit", () => {
        if (errorString) reject(errorString);
        else {
          const codeExec = spawn(
            `${path.join(
              __dirname,
              `../classes/${codeFile.split(".")[0]}`
            )}.out`,
            []
          );

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
        }
      });
    });

    return {
      success: true,
      timestamp: new Date(),
      output,
      language: "cpp",
      version: "11.2.0",
    };
  } catch (error) {
    return {
      success: false,
      timestamp: new Date(),
      error,
      language: "cpp",
      version: "11.2.0",
    };
  }
};

const executeCPP = async (codeFile, inputs) => {
  return await runCode(codeFile, inputs);
};

module.exports = {
  executeCPP,
};
