const { createCodeFile } = require("./createCodeFile");
const { executeJava, executePython, executeCorCPP } = require("./executeCode");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
var cors = require("cors"); //use this

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Total languages supported
const supportedLanguages = ["java", "cpp", "py", "c"];
const compilerVersions = ["11.0.15", "11.2.0", "3.7.7", "11.2.0"];

app.post("/", async (req, res) => {
  let output = "";
  const { language = "java", code, input = "" } = req.body;

  if (code === undefined) output = "No code specified to execute.";
  if (!supportedLanguages.includes(language))
    output = `Language ${language} is not supported. Please refer to docs to know the supported languages.`;

  if (code !== undefined && supportedLanguages.includes(language)) {
    const codeFile = createCodeFile(language, code);

    switch (language) {
      case "java":
        output = await executeJava(codeFile, input);
        break;
      case "py":
        output = await executePython(codeFile, input);
        break;
      case "cpp":
        output = await executeCorCPP(codeFile, input);
        break;
      case "c":
        output = await executeCorCPP(codeFile, input);
        break;
    }
  }

  res.send(output);
});

app.get("/list", (req, res) => {
  let versionObj = [];
  for (let i = 0; i < supportedLanguages.length; i++) {
    versionObj.push({
      language: supportedLanguages[i],
      compilerVersion: compilerVersions[i],
    });
  }
  res.send(versionObj);
});

app.listen(port);
