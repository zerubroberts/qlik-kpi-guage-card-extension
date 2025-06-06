#!/usr/bin/env python3
import zipfile
import os

def create_extension_zip():
    """Create a zip file for the Qlik Sense extension"""
    
    zip_name = "kpi-card-advanced.zip"
    
    # Files to include in the zip
    files_to_zip = [
        "kpi-card-advanced.qext",
        "kpi-card-advanced.js",
        "kpi-card-advanced.css",
        "src/properties.js",
        "README.md",
        "docs/USAGE.md"
    ]
    
    # Create zip file
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files_to_zip:
            if os.path.exists(file):
                # Add file to zip with correct path
                if file.startswith("src/") or file.startswith("docs/"):
                    zipf.write(file, file)
                else:
                    zipf.write(file, file)
                print(f"Added: {file}")
            else:
                print(f"Warning: {file} not found")
    
    print(f"\nBuild complete! Extension packaged as {zip_name}")
    
    # List contents of the zip
    print("\nZip contents:")
    with zipfile.ZipFile(zip_name, 'r') as zipf:
        for info in zipf.filelist:
            print(f"  {info.filename}")

if __name__ == "__main__":
    create_extension_zip()