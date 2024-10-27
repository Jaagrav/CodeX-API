FROM ubuntu:18.04

# Ensure proper dpkg configuration
RUN dpkg --configure -a

# Set environment variables
ENV PYTHON_VERSION 3.7.7
ENV PYTHON_PIP_VERSION 20.1
ENV DEBIAN_FRONTEND noninteractive

# Install dependencies
RUN apt-get update && apt-get -y install gcc mono-mcs golang-go \
    default-jre default-jdk nodejs npm \
    python3-pip python3 curl && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js using NVM
ENV NODE_VERSION=16.13.2
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Create a non-root user with a UID between 10000 and 20000
RUN useradd -m -u 10001 appuser
USER 10001

# Copy application code and set up the working directory
COPY --chown=appuser:appuser . /app
WORKDIR /app
RUN npm install

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
