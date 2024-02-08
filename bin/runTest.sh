#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Error: No input file specified."
    echo "Usage: npx trowser path/to/your/input/file.ts"
    exit 1
fi

# The first argument is the input TypeScript file
INPUT_FILE="$1"
# Define the temporary entry point file
ENTRY_POINT="temp_entry.ts"
# Define the output JS file
OUTPUT_FILE="dist/bundle.js"
# Path to your static HTML file in the repo
HTML_TEMPLATE="static/index.html"
# The final HTML file to open in Chrome
FINAL_HTML="dist/index.html"

# Ensure the dist directory exists
mkdir -p dist

# Create the temporary entry point file that imports the test framework and the input test file
echo "import './src/index.ts';" > "$ENTRY_POINT"
echo "import '$INPUT_FILE';" >> "$ENTRY_POINT"

# Use esbuild to bundle the temporary entry point file into a single JS file
npx esbuild "$ENTRY_POINT" --bundle --outfile="$OUTPUT_FILE" --platform=browser

# Clean up the temporary entry point file after building
rm "$ENTRY_POINT"

# Create a new HTML file based on the template, injecting the script
cp "$HTML_TEMPLATE" "$FINAL_HTML"

# Open the final HTML file in a new Chrome tab
open -a "Google Chrome" "$FINAL_HTML"
