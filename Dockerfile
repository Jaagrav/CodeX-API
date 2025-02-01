FROM ubuntu:18.04

# Set environment variables
ENV PYTHON_VERSION 3.7.7
ENV PYTHON_PIP_VERSION 20.1
ENV DEBIAN_FRONTEND noninteractive
ENV NODE_VERSION 16

# Update and install dependencies
RUN apt-get update && apt-get -y install gcc mono-mcs golang-go \
    default-jre default-jdk python3-pip python3 curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Verify that Node.js is installed
RUN node -v && npm -v

# Create a non-root user with a UID between 10000 and 20000
RUN useradd -m -u 10001 appuser

# Verify that the user is set correctly
RUN id -u appuser

# Set up the working directory with correct permissions
WORKDIR /app
COPY . /app
RUN chown -R appuser:appuser /app

# Temporarily switch to root to run npm install
USER root
RUN npm install --unsafe-perm

# Switch back to non-root user
USER appuser

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
