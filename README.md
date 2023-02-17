# CodeX API

> This API is still in very early stages of development. So consider not using the API in production since things might change in the future.

## Introducing the new CodeX API

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

## Examples

- [NodeJS](examples/js/index.js)
- [Golang](examples/golang/main.go)

### Sample Output

The output is a JSON object comprising only one parameter that is the output.

```json
{
  "timeStamp": 1672439982964,
  "status": 200,
  "output": "Enter your value: 12\n",
  "error": "",
  "language": "py",
  "info": "Python 3.6.9\n"
}
```

> Since a lot of people had issues with executing the previous API from backend or serverless function, unlike the previous version of the API, this version of the API won't throw any Cross Origin errors so you can use this from the front end without any worries. Thank me later ;)

#### `GET` /list

This endpoint allows you to list all languages supported and their versions.

```json
{
  "timeStamp": 1672440064864,
  "status": 200,
  "supportedLanguages": [
    {
      "language": "java",
      "info": "openjdk 11.0.17 2022-10-18\nOpenJDK Runtime Environment (build 11.0.17+8-post-Ubuntu-1ubuntu218.04)\nOpenJDK 64-Bit Server VM (build 11.0.17+8-post-Ubuntu-1ubuntu218.04, mixed mode, sharing)\n"
    },
    {
      "language": "cpp",
      "info": "g++ (Ubuntu 7.5.0-3ubuntu1~18.04) 7.5.0\nCopyright (C) 2017 Free Software Foundation, Inc.\nThis is free software; see the source for copying conditions.  There is NO\nwarranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.\n\n"
    },
    {
      "language": "py",
      "info": "Python 3.6.9\n"
    },
    {
      "language": "c",
      "info": "gcc (Ubuntu 7.5.0-3ubuntu1~18.04) 7.5.0\nCopyright (C) 2017 Free Software Foundation, Inc.\nThis is free software; see the source for copying conditions.  There is NO\nwarranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.\n\n"
    },
    {
      "language": "js",
      "info": "v16.13.2\n"
    },
    {
      "language": "go",
      "info": "go version go1.10.4 linux/amd64\n"
    },
    {
      "language": "cs",
      "info": "Mono C# compiler version 4.6.2.0\n"
    }
  ]
}
```

> This API is deployed on a free instance on [render](https://render.com/) so shoutout to render for providing a platform that helped bringing back the CodeX API after a long down time. Since I am using a free tier, the API might be slow sometimes, so please be patient while I try to fund this project.

Happy hacking!
