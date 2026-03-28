#!/usr/bin/env python3
"""
yasakei Depiction Generator
Generates HTML depiction pages from JSON data files
"""

import os
import json
import argparse
from pathlib import Path

def generate_depiction(json_file, output_dir, base_url):
    """Generate HTML depiction from JSON file"""
    
    # Load JSON data
    with open(json_file, 'r') as f:
        data = json.load(f)
    
    # Get package name from filename or data
    package_name = Path(json_file).stem
    tweak_name = data.get('name', package_name)
    
    # Read template
    template_path = Path(__file__).parent / 'assets' / 'depiction-template.html'
    with open(template_path, 'r') as f:
        template = f.read()
    
    # Replace placeholders
    html = template.replace('{NAME}', tweak_name)
    html = html.replace('{JSON_DATA}', json.dumps(data))
    
    # Write output
    output_file = output_dir / f'{package_name}.html'
    with open(output_file, 'w') as f:
        f.write(html)
    
    print(f"✓ Generated: {output_file}")


def copy_assets(output_dir):
    """Copy CSS and JS to depictions/assets folder"""
    script_dir = Path(__file__).parent
    assets_dir = script_dir / 'assets'
    dest_dir = output_dir / 'assets'
    
    # Create destination directory
    dest_dir.mkdir(exist_ok=True)
    
    # Copy CSS and JS files
    for file in assets_dir.glob('*.css'):
        dest = dest_dir / file.name
        dest.write_text(file.read_text())
        print(f"✓ Copied: {file.name}")
    
    for file in assets_dir.glob('*.js'):
        dest = dest_dir / file.name
        dest.write_text(file.read_text())
        print(f"✓ Copied: {file.name}")

def main():
    parser = argparse.ArgumentParser(description='Generate depiction pages')
    parser.add_argument('--package', '-p', help='Specific package to generate')
    parser.add_argument('--all', '-a', action='store_true', help='Generate all packages')
    parser.add_argument('--base-url', default='', help='Base URL for the repo')
    
    args = parser.parse_args()
    
    script_dir = Path(__file__).parent
    packages_dir = script_dir / 'packages'
    depictions_dir = script_dir / 'depictions'
    
    # Create depictions directory
    depictions_dir.mkdir(exist_ok=True)
    
    # Copy assets to depictions folder
    copy_assets(depictions_dir)
    
    if args.package:
        json_file = packages_dir / f'{args.package}.json'
        if json_file.exists():
            generate_depiction(json_file, depictions_dir, args.base_url)
        else:
            print(f"✗ Package not found: {args.package}")
    elif args.all:
        json_files = list(packages_dir.glob('*.json'))
        if not json_files:
            print("No JSON files found in packages/")
            return
        for json_file in json_files:
            generate_depiction(json_file, depictions_dir, args.base_url)
        print(f"\n✓ Generated {len(json_files)} depiction(s)")
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
