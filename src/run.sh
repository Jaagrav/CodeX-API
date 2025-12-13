#!/bin/bash

# Configuration
ENTRY_FILE="index.js"  # Change to your entry point (server.js, app.js, etc.)
PORT="8080"            # Your Express server port
PID_FILE="/tmp/express_pids.sh"
LOG_DIR="logs"

# Auto-detect entry file if not found
detect_entry_file() {
    if [ -f "$ENTRY_FILE" ]; then
        echo "$ENTRY_FILE"
        return
    fi
    
    # Common entry point names
    for file in index.js server.js app.js main.js src/index.js src/server.js; do
        if [ -f "$file" ]; then
            echo "$file"
            return
        fi
    done
    
    # Check package.json for main field
    if [ -f "package.json" ]; then
        MAIN=$(node -pe "try { require('./package.json').main } catch(e) { '' }" 2>/dev/null)
        if [ -n "$MAIN" ] && [ -f "$MAIN" ]; then
            echo "$MAIN"
            return
        fi
    fi
    
    echo ""
}

# Detect the actual entry file
DETECTED_ENTRY=$(detect_entry_file)
if [ -z "$DETECTED_ENTRY" ]; then
    echo "✗ Error: Could not find entry file"
    echo "  Checked: index.js, server.js, app.js, main.js, package.json main field"
    echo "  Please update ENTRY_FILE in the script"
    exit 1
fi
ENTRY_FILE="$DETECTED_ENTRY"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        echo "✗ Error: Node.js is not installed"
        echo "  Install from: https://nodejs.org/"
        exit 1
    fi
    echo "✓ Node.js $(node --version) detected"
}

# Function to check if package.json exists
check_package_json() {
    if [ ! -f "package.json" ]; then
        echo "⚠ Warning: No package.json found"
        echo "  Continuing anyway..."
        return
    fi
    echo "✓ package.json found"
}

# Function to check if dependencies are installed
check_dependencies() {
    if [ ! -d "node_modules" ]; then
        echo "⚠ node_modules not found. Installing dependencies..."
        
        # Detect package manager
        if [ -f "pnpm-lock.yaml" ]; then
            pnpm install
        elif [ -f "yarn.lock" ]; then
            yarn install
        else
            npm install
        fi
        
        if [ $? -ne 0 ]; then
            echo "✗ Failed to install dependencies"
            exit 1
        fi
        echo "✓ Dependencies installed"
    else
        echo "✓ node_modules found"
    fi
}

# Function to start Express server
start_server() {
    echo "Starting Express server ($ENTRY_FILE)..."
    
    # Start the server
    nohup node "$ENTRY_FILE" > "$LOG_DIR/express.log" 2>&1 &
    EXPRESS_PID=$!
    sleep 2
    
    # Check if process is still running
    if ps -p $EXPRESS_PID > /dev/null; then
        echo "✓ Express server started with PID: $EXPRESS_PID"
        echo "EXPRESS_PID=$EXPRESS_PID" > "$PID_FILE"
        echo "ENTRY_FILE=$ENTRY_FILE" >> "$PID_FILE"
        echo "✓ PID saved to $PID_FILE"
        echo ""
        echo "=== Express Server Running ==="
        echo "• Entry:   $ENTRY_FILE"
        echo "• Port:    $PORT (if configured)"
        echo "• Logs:    $LOG_DIR/express.log"
        echo ""
        echo "To view logs: tail -f $LOG_DIR/express.log"
        echo "To stop: $0 0"
    else
        echo "✗ Failed to start Express server"
        echo ""
        echo "Last few lines of log:"
        tail -n 10 "$LOG_DIR/express.log"
        exit 1
    fi
}

# Function to stop Express server
stop_server() {
    echo "=== Stopping Express Server ==="
    
    STOPPED=false
    
    if [ -f "$PID_FILE" ]; then
        source "$PID_FILE"
        
        if [ -n "$EXPRESS_PID" ]; then
            if ps -p $EXPRESS_PID > /dev/null 2>&1; then
                kill $EXPRESS_PID
                sleep 1
                # Force kill if still running
                if ps -p $EXPRESS_PID > /dev/null 2>&1; then
                    kill -9 $EXPRESS_PID 2>/dev/null
                fi
                echo "✓ Stopped Express server (PID: $EXPRESS_PID)"
                STOPPED=true
            else
                echo "• Express process not running (PID: $EXPRESS_PID)"
            fi
        fi
        
        rm -f "$PID_FILE"
        echo "✓ Removed PID file"
    fi
    
    if [ "$STOPPED" = false ]; then
        echo "• No PID file found. Checking for running processes..."
        
        # Try to kill by port
        if command -v lsof &> /dev/null; then
            PORT_PID=$(lsof -ti:$PORT 2>/dev/null)
            if [ -n "$PORT_PID" ]; then
                kill $PORT_PID 2>/dev/null
                sleep 1
                kill -9 $PORT_PID 2>/dev/null
                echo "✓ Killed process on port $PORT (PID: $PORT_PID)"
                STOPPED=true
            fi
        fi
        
        # Try to kill by process name
        NODE_PIDS=$(pgrep -f "node.*$ENTRY_FILE" 2>/dev/null)
        if [ -n "$NODE_PIDS" ]; then
            kill $NODE_PIDS 2>/dev/null
            sleep 1
            kill -9 $NODE_PIDS 2>/dev/null
            echo "✓ Killed Node processes: $NODE_PIDS"
            STOPPED=true
        fi
    fi
    
    if [ "$STOPPED" = false ]; then
        echo "• No Express server found running"
    fi
    
    echo "=== Stop operation completed ==="
}

# Function to start the process
start_process() {
    echo "=== Starting Express Server ==="
    
    # Check if already running
    if [ -f "$PID_FILE" ]; then
        source "$PID_FILE"
        if ps -p $EXPRESS_PID > /dev/null 2>&1; then
            echo "⚠ Express server is already running (PID: $EXPRESS_PID)!"
            echo "Run '$0 0' to stop it first"
            exit 1
        fi
    fi
    
    # Check if port is already in use
    if command -v lsof &> /dev/null; then
        if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "⚠ Port $PORT is already in use!"
            echo "Stop the process using the port or change PORT in the script"
            exit 1
        fi
    fi
    
    # Check Node.js
    check_node
    
    # Check package.json
    check_package_json
    
    # Check dependencies
    check_dependencies
    
    # Start server
    start_server
}

# Function to show status
show_status() {
    echo "=== Express Server Status ==="
    
    if [ -f "$PID_FILE" ]; then
        source "$PID_FILE"
        if ps -p $EXPRESS_PID > /dev/null 2>&1; then
            echo "✓ Express server is running (PID: $EXPRESS_PID)"
            echo "• Entry: $ENTRY_FILE"
            echo "• Port:  $PORT"
            echo "• Logs:  $LOG_DIR/express.log"
        else
            echo "✗ Server not running (stale PID file)"
        fi
    else
        if command -v lsof &> /dev/null; then
            PORT_PID=$(lsof -ti:$PORT 2>/dev/null)
            if [ -n "$PORT_PID" ]; then
                echo "⚠ Something running on port $PORT (PID: $PORT_PID)"
                echo "  But no PID file found. May not be managed by this script."
            else
                echo "• Express server is not running"
            fi
        else
            echo "• Cannot check port status (lsof not available)"
            echo "• No PID file found"
        fi
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [1|0|status]"
    echo "  1      - Start Express server"
    echo "  0      - Stop Express server"
    echo "  status - Show server status"
    echo ""
    echo "Configuration:"
    echo "  Entry file: $ENTRY_FILE"
    echo "  Port:       $PORT"
    echo ""
    echo "Examples:"
    echo "  $0 1       # Start server"
    echo "  $0 0       # Stop server"
    echo "  $0 status  # Check status"
}

# Main execution
main() {
    if [ $# -eq 0 ]; then
        show_usage
        exit 1
    fi
    
    case "$1" in
        1)
            start_process
            ;;
        0)
            stop_server
            ;;
        status)
            show_status
            ;;
        *)
            echo "✗ Invalid argument: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with arguments
main "$@"