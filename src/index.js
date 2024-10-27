const {runCode} = require("./run-code");
const {supportedLanguages} = require("./run-code/instructions");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const {info} = require("./run-code/info");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const sendResponse = (res, statusCode, body) => {
    const timeStamp = Date.now()

    res.status(statusCode).send({
        timeStamp,
        status: statusCode,
        ...body
    })
}

app.post("/", async (req, res) => {
    try {
        const output = await runCode(req.body)
        sendResponse(res, 200, output)
    } catch (err) {
        sendResponse(res, err?.status || 500, err)
    }
})

app.get('/list', async (req, res) => {
    const body = []

    for(const language of supportedLanguages) {
        body.push({
            language,
            info: await info(language),
        })
    }

    sendResponse(res, 200, {supportedLanguages: body})
})

app.listen(port);
