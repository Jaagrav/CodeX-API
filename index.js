const { createCodeFile } = require("./createCodeFile");
const { executeJava, executePython, executeCPP } = require("./executeCode");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
var cors = require("cors"); //use this

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Total languages supported
const supportedLanguages = ["java", "cpp", "py"];

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
        output = await executeCPP(codeFile, input);
        break;
    }
  }

  res.send(output);
});

app.listen(port);
