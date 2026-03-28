#!/bin/bash

# yasakei Repo Builder
# Generates Packages, Packages.gz, Release files, and Depictions

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEB_DIR="$REPO_DIR/deb"

echo "📦 Building yasakei repo..."

# Generate Packages file
echo "Generating Packages..."
dpkg-scanpackages -m deb > "$REPO_DIR/Packages" 2>/dev/null || true

# Compress Packages
echo "Compressing Packages..."
gzip -c "$REPO_DIR/Packages" > "$REPO_DIR/Packages.gz"

# Generate depictions
echo "Generating Depictions..."
if command -v python3 &> /dev/null; then
    python3 "$REPO_DIR/generate-depictions.py" --all
else
    echo "⚠ Python3 not found, skipping depictions"
fi

# Generate Release file
echo "Generating Release..."
cat > "$REPO_DIR/Release" << EOF
Origin: yasakei
Label: yasakei
Suite: stable
Version: 1.0
Codename: ios
Architectures: iphoneos-arm iphoneos-arm64 all
Components: main
Description: yasakei - iOS Tweaks Repository (32-bit & 64-bit)
MD5Sum:
SHA256:
EOF

# Add MD5 and SHA256 sums
MD5_PACKAGES=$(md5sum "$REPO_DIR/Packages" | awk '{print $1}')
MD5_PACKAGES_GZ=$(md5sum "$REPO_DIR/Packages.gz" | awk '{print $1}')
SHA256_PACKAGES=$(sha256sum "$REPO_DIR/Packages" | awk '{print $1}')
SHA256_PACKAGES_GZ=$(sha256sum "$REPO_DIR/Packages.gz" | awk '{print $1}')
SIZE_PACKAGES=$(stat -f%z "$REPO_DIR/Packages" 2>/dev/null || stat -c%s "$REPO_DIR/Packages")
SIZE_PACKAGES_GZ=$(stat -f%z "$REPO_DIR/Packages.gz" 2>/dev/null || stat -c%s "$REPO_DIR/Packages.gz")

echo " $MD5_PACKAGES $SIZE_PACKAGES Packages" >> "$REPO_DIR/Release"
echo " $MD5_PACKAGES_GZ $SIZE_PACKAGES_GZ Packages.gz" >> "$REPO_DIR/Release"
echo " $SHA256_PACKAGES $SIZE_PACKAGES Packages" >> "$REPO_DIR/Release"
echo " $SHA256_PACKAGES_GZ $SIZE_PACKAGES_GZ Packages.gz" >> "$REPO_DIR/Release"

echo "✅ Repo build complete!"
echo ""
echo "Files generated:"
ls -la "$REPO_DIR"/*.gz "$REPO_DIR"/Packages "$REPO_DIR"/Release 2>/dev/null || true
