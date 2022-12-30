# Setup CodeX-API Locally

In order to setup this project locally on your machine, you can either run the docker image or run the nodejs app directly using node. Although running directly using node is not recommended since we're dealing with installing so many languages like java, c, c++, etc. You'd need to install SDKs and Compilers for each of the language supported by this API for testing purposes.

### Install project (using Docker)

```bash
docker build --no-cache -t codex-api .

docker run -p 3000:3000 codex-api
```
