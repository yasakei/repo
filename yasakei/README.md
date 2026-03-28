# yasakei

Cydia/Zebra repository for iOS tweaks (32-bit & 64-bit).

## 📲 Add to Package Manager

### Cydia
1. Open **Cydia**
2. Go to **Sources** → **Edit** → **Add**
3. Enter: `https://your-github-url.github.io/yasakei/`
4. Tap **Add Source**

### Zebra
1. Open **Zebra**
2. Go to **Sources** tab
3. Tap **+** icon
4. Enter: `https://your-github-url.github.io/yasakei/`
5. Tap **Add**

---

## 📦 Adding Tweaks to the Repo

### Method 1: Using Theos (Recommended)

```bash
# 1. Clone or create your tweak with Theos
git clone https://github.com/theos/theos.git
export THEOS=/path/to/theos

# 2. Create new tweak
$THEOS/bin/nic.pl

# 3. Build the tweak
make package

# 4. Copy .deb to repo
cp packages/*.deb /path/to/yasakei/deb/

# 5. Build repo
cd /path/to/yasakei
./build.sh
```

### Method 2: Existing .deb Files

```bash
# 1. Place your .deb file in deb/ folder
cp mytweak_1.0_iphoneos-arm.deb yasakei/deb/

# 2. Build the repo
cd yasakei
./build.sh
```

### Method 3: Manual Package Entry

Create a control file in `deb/DEBIAN/control`:

```
Package: com.yasakei.mytweak
Name: MyTweak
Version: 1.0.0
Architecture: iphoneos-arm
Description: An amazing iOS tweak
Maintainer: yasakei
Author: yasakei
Section: Tweaks
Depends: mobilesubstrate, firmware (>= 13.0)
Homepage: https://github.com/yourusername/mytweak
Icon: https://your-url.github.io/yasakei/icons/70x70/com.yasakei.mytweak.png
```

---

## 🏗️ Building the Repo

```bash
# Navigate to repo
cd yasakei

# Run build script
./build.sh

# This generates:
# - Packages (package index)
# - Packages.gz (compressed index)
# - Release (repo metadata)
# - Depictions (HTML pages for each tweak)
```

---

## 🎨 Depiction Framework

The repo includes a **modern depiction framework** for beautiful tweak pages in Cydia/Zebra.

### Quick Start

```bash
# 1. Create JSON file for your tweak
cp packages/example.json packages/com.yasakei.mytweak.json

# 2. Edit the JSON with your tweak info
# (see JSON structure below)

# 3. Generate depiction pages
python3 generate-depictions.py --all

# 4. Build the repo
./build.sh
```

### JSON Structure

Create a `.json` file in `packages/` with this structure:

```json
{
  "name": "MyTweak",
  "version": "1.0.0",
  "author": "yasakei",
  "maintainer": "yasakei",
  "description": "What your tweak does...",
  "icon": "https://your-url.github.io/yasakei/icons/70x70/com.yasakei.mytweak.png",
  "category": "Tweaks",
  "size": "1.2 MB",
  "homepage": "https://github.com/yourusername/mytweak",
  "source": "https://github.com/yourusername/mytweak",
  "donate": "https://paypal.me/yourusername",
  "discord": "https://discord.gg/yourserver",
  "screenshots": [
    "https://your-url.github.io/yasakei/assets/screenshots/mytweak-1.png",
    "https://your-url.github.io/yasakei/assets/screenshots/mytweak-2.png"
  ],
  "compatibility": [
    { "ios": "iOS 15", "working": true },
    { "ios": "iOS 14", "working": true },
    { "ios": "iOS 13", "working": false, "status": "Not Supported" }
  ],
  "changelog": [
    {
      "version": "1.0.0",
      "date": "2026-03-28",
      "changes": [
        "Initial release",
        "Bug fixes"
      ]
    }
  ]
}
```

### JSON Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Tweak display name |
| `version` | string | ✅ | Current version |
| `author` | string | ✅ | Developer name |
| `maintainer` | string | ❌ | Maintainer (defaults to author) |
| `description` | string | ✅ | Full description |
| `icon` | string | ❌ | Icon URL (70x70 or 120x120) |
| `category` | string | ❌ | Category (e.g., Tweaks, UI) |
| `size` | string | ❌ | Package size |
| `homepage` | string | ❌ | Homepage URL |
| `source` | string | ❌ | Source code URL |
| `donate` | string | ❌ | Donation/PayPal URL |
| `discord` | string | ❌ | Discord server invite |
| `screenshots` | array | ❌ | Array of screenshot URLs |
| `compatibility` | array | ❌ | iOS version compatibility |
| `changelog` | array | ❌ | Version history |

### Commands

```bash
# Generate all depictions
python3 generate-depictions.py --all

# Generate single package
python3 generate-depictions.py --package com.yasakei.mytweak

# With custom base URL
python3 generate-depictions.py --all --base-url "https://repo.yasakei.com"
```

### Depiction URL Format

```
https://your-url.github.io/yasakei/depictions/com.yasakei.mytweak.html
```

### Add to Package Control File

```
Depiction: https://your-url.github.io/yasakei/depictions/com.yasakei.mytweak.html
```

---

## 🌐 Hosting Options

### GitHub Pages (Free)

```bash
# 1. Create a GitHub repository named: yourusername.github.io
git init
git remote add origin https://github.com/yourusername/yourusername.github.io.git

# 2. Copy repo contents
cp -r yasakei/* /path/to/yourusername.github.io/

# 3. Push to GitHub
cd /path/to/yourusername.github.io
git add .
git commit -m "Add yasakei repo"
git push -u origin main

# 4. Your repo URL will be:
# https://yourusername.github.io/
```

### Self-Hosting

```bash
# Using Python simple server (testing only)
cd yasakei
python3 -m http.server 8080

# Using nginx (production)
server {
    listen 80;
    server_name repo.yasakei.com;
    root /var/www/yasakei;
    index Packages;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

## 📁 Repository Structure

```
yasakei/
├── deb/                    # Place .deb packages here
│   └── mytweak_1.0.deb
├── packages/               # Optional: tweak sources
│   └── mytweak/
│       ├── Makefile
│       ├── control
│       └── src/
├── icons/                  # Tweak icons
│   ├── 70x70/             # Cydia icon size
│   │   └── com.package.name.png
│   └── 120x120/           # Zebra icon size
│       └── com.package.name.png
├── assets/                 # Screenshots, banners
├── build.sh               # Repo builder
├── Packages               # Generated package index
├── Packages.gz            # Compressed index
├── Release                # Repo metadata
└── README.md              # This file
```

---

## 🎨 Adding Icons

### For Cydia (70x70)
```bash
# Place PNG icon in icons/70x70/
cp mytweak-icon.png yasakei/icons/70x70/com.yasakei.mytweak.png
```

### For Zebra (120x120)
```bash
# Place PNG icon in icons/120x120/
cp mytweak-icon.png yasakei/icons/120x120/com.yasakei.mytweak.png
```

### Icon Requirements
- Format: PNG
- Background: Transparent recommended
- Size: 70x70 (Cydia), 120x120 (Zebra)
- No rounded corners needed (applying automatically)

---

## 📝 Package Control File Template

```
Package: com.yasakei.tweakname
Name: TweakName
Version: 1.0.0
Architecture: iphoneos-arm
Description: Short description of your tweak
Maintainer: YourName
Author: YourName
Section: Tweaks
Depends: mobilesubstrate, firmware (>= 13.0)
Homepage: https://github.com/yourusername/tweakname
Icon: https://your-url.github.io/yasakei/icons/70x70/com.yasakei.tweakname.png
```

### Control File Fields

| Field | Required | Description |
|-------|----------|-------------|
| Package | ✅ | Unique bundle ID (reverse DNS) |
| Name | ✅ | Display name |
| Version | ✅ | Semantic version (e.g., 1.0.0) |
| Architecture | ✅ | `iphoneos-arm` (32-bit), `iphoneos-arm64` (64-bit), or `all` |
| Description | ✅ | What your tweak does |
| Maintainer | ✅ | Your name/handle |
| Section | ✅ | Usually `Tweaks` |
| Dependent | ❌ | Dependencies |
| Homepage | ❌ | Source code URL |
| Icon | ❌ | Icon URL |

### Architecture Types

| Architecture | Devices | iOS Versions |
|--------------|---------|--------------|
| `iphoneos-arm` | iPhone 4S - iPhone 5S | iOS 5 - iOS 12 (32-bit) |
| `iphoneos-arm64` | iPhone 5S and newer | iOS 7+ (64-bit) |
| `all` | All devices | Universal packages |

---

## 🔧 Troubleshooting

### Package Not Showing Up
```bash
# Rebuild repo
./build.sh

# Clear Cydia/Zebra cache
# Cydia: Settings → Refresh
# Zebra: Sources → Pull to refresh
```

### Icon Not Displaying
- Check icon URL in control file matches actual path
- Ensure icon is PNG format
- Verify file permissions (644)

### Build Script Errors
```bash
# Install required tools
# macOS
brew install dpkg

# Linux
sudo apt-get install dpkg-dev
```

---

## 📚 Resources

- [Theos Documentation](https://theos.dev/docs/)
- [Cydia Package Format](https://theos.dev/docs/packaging)
- [Zebra Repo Format](https://github.com/ZebraTeam/Zebra)
- [dpkg-deb Reference](https://manpages.debian.org/dpkg-deb)

---

## 📄 License

MIT License - Feel free to use this repo structure for your own tweaks!
