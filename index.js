const { createCodeFile } = require("./createCodeFile");
const { executeJava, executePython } = require("./executeCode");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Total languages supported
const supportedLanguages = ["java", "cpp", "py"];

app.post("/", async (req, res) => {
  const { language = "java", code, input = "" } = req.body;
  if (code === undefined) res.status(500).send("No code specified to execute.");
  if (!supportedLanguages.includes(language))
    res
      .status(500)
      .send(
        `Language ${language} is not supported. Please refer to docs to know the supported languages.`
      );

  const codeFile = createCodeFile(language, code);
  let output = "";

  switch (language) {
    case "java":
      output = await executeJava(codeFile, input);
      break;
    case "py":
      output = await executePython(codeFile, input);
      break;
  }

  res.send(output);
});

app.listen(port);
