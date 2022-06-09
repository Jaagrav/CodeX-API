# CodeX API

> This API is still in very early stages of development. So consider not using the API in production.

### Introducing the new CodeX API

Here's how you can execute code in various languages on your own website for free (no, there's no fucking catch, it's literally free),

### Execute Code and fetch output

#### `POST` /

This endpoint allows you to execute your script and fetch output results.

### What are the Input Parameters for execute api call?

| Parameter  | Description                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| "code"     | Should contain the script that needs to be executed                                                                           |
| "language" | Language that the script is written in for example: java, cpp, etc. (Check language as a payload down below in next question) |
| "input"    | In case the script requires any kind of input for execution, leave empty if no input required                                 |

### What are the languages that are supported for execution?

Whichever language you might mention in the language field, it would be automatically executed with the latest version of it's compiler.
| Languages | Language as a payload |
|-----------|-----------------------|
| Java | java |
| Python | py |
| C++ | cpp |
| C | c |
| GoLang | go |
| C# | cs |
| NodeJS | js |

More coming very soon!

### NodeJS Example to Execute API Call?

```js
var axios = require("axios");
var qs = require("qs");
var data = qs.stringify({
  code: "import java.util.Scanner;\npublic class MatSym {\n    public static void main(String[]args) {\n       Scanner in = new Scanner(System.in);\nSystem.out.println(in.nextLine());\nSystem.out.println(in.nextLine());\n    }\n}",
  language: "java",
  input: "Hello\nWorld",
});
var config = {
  method: "post",
  url: "https://codex-api.herokuapp.com/",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
```

### Sample Output

The output is a JSON object comprising only one parameter that is the output.

```json
{
  "success": true,
  "timestamp": "2022-05-26T19:59:08.014Z",
  "output": "Hello\nWorld\n",
  "language": "java",
  "version": "11.0.15"
}
```

> Since a lot of people had issues with executing the previous API from backend or serverless function, unlike the previous version of the API, this version of the API won't throw any Cross Origin errors so you can use this from the front end without any worries. Thank me later ;)

#### `GET` /list

This endpoint allows you to list all languages supported and their versions.

```json
[
  {
    "language": "java",
    "compilerVersion": "11.0.15"
  },
  {
    "language": "cpp",
    "compilerVersion": "11.2.0"
  },
  {
    "language": "py",
    "compilerVersion": "3.7.7"
  },
  {
    "language": "c",
    "compilerVersion": "11.2.0"
  }
]
```

Happy hacking!
