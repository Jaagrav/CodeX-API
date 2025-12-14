FROM ubuntu:18.04

# Set environment variables
ENV PYTHON_VERSION 3.7.7
ENV PYTHON_PIP_VERSION 20.1
ENV DEBIAN_FRONTEND noninteractive
ENV NODE_VERSION 16

# Update and install dependencies, including Node 16 directly
RUN apt-get update && apt-get -y install gcc mono-mcs golang-go \
    default-jre default-jdk python3-pip python3 curl fpc && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Verify that Node 16 is installed
RUN node -v && npm -v

# Create a non-root user with a UID between 10000 and 20000
RUN useradd -m -u 10001 appuser
USER 10001

# Copy application code and set up the working directory
COPY --chown=appuser:appuser . /app
WORKDIR /app
RUN npm install

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
