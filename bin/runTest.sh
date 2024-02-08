#!/bin/bash

# Exit immediately if any command has a non-zero exit status
set -e

# Check if exactly one argument is provided
if [ "$#" -ne 1 ]; then
    echo "Error: No input file specified."
    echo "Usage: npx trowser path/to/your/input/file.ts"
    exit 1
fi

# Convert input file to an absolute path
INPUT_FILE=$(realpath "$1")

# Getting system's temporary directory
TEMP_DIR=$(node -e "console.log(require('os').tmpdir())")

# Using a subdirectory in the temp directory unique to your script
APP_TEMP_DIR="$TEMP_DIR/trowser"
# Ensure this directory exists
mkdir -p "$APP_TEMP_DIR/dist"

# Define the absolute path for src/index.ts assuming script resides in bin/ and src/ is at package's root
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
SRC_PATH="$SCRIPT_DIR/../src/index.ts"

# Define the temporary entry point file
ENTRY_POINT="$APP_TEMP_DIR/temp_entry.ts"
# Define the output JS file
OUTPUT_FILE="$APP_TEMP_DIR/dist/bundle.js"
# The final HTML file to open in Chrome
FINAL_HTML="$APP_TEMP_DIR/dist/index.html"
# Path to your static HTML file in the repo
HTML_TEMPLATE="$SCRIPT_DIR/../static/index.html"

# Creating the temporary entry point file with absolute paths
echo "import '$SRC_PATH';" > "$ENTRY_POINT"
echo "import '$INPUT_FILE';" >> "$ENTRY_POINT"

# Use esbuild to bundle the temporary entry point file into a single JS file
npx esbuild "$ENTRY_POINT" --bundle --outfile="$OUTPUT_FILE" --platform=browser

# Clean up the temporary entry point file after building
rm "$ENTRY_POINT"

# Create a new HTML file based on the template, injecting the script
cp "$HTML_TEMPLATE" "$FINAL_HTML"

# Open the final HTML file in the user's default browser
case "$(uname)" in
    "Linux"*)     xdg-open "$FINAL_HTML" ;;
    "Darwin"*)    open -a "Google Chrome" "$FINAL_HTML" ;;
    CYGWIN*|MINGW32*|MSYS*|MINGW*)
        # Windows (under Cygwin, MinGW, MSYS, etc.)
        cmd.exe /c start "$FINAL_HTML"
        ;;
    *)
        echo "Browser opening is not supported on this OS." ;;
esac