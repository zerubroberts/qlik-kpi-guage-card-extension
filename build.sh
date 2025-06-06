#!/bin/bash

# KPI Card Advanced Extension Build Script

echo "Building KPI Card Advanced Extension..."

# Create build directory
mkdir -p build

# Define files to include
FILES=(
    "kpi-card-advanced.qext"
    "kpi-card-advanced.js"
    "kpi-card-advanced.css"
    "src/properties.js"
    "README.md"
    "docs/USAGE.md"
)

# Create zip file
ZIP_NAME="kpi-card-advanced.zip"

# Remove old zip if exists
if [ -f "$ZIP_NAME" ]; then
    rm "$ZIP_NAME"
fi

# Create new zip with specified files
zip -r "$ZIP_NAME" "${FILES[@]}"

echo "Build complete! Extension packaged as $ZIP_NAME"