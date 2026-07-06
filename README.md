# Booru to SD WebUI Extractor

A Manifest V3 browser extension for Chromium-based browsers (Brave, Chrome) that extracts image tags from Booru-style boards and automatically formats them for local Stable Diffusion generation. 

Instead of manually typing or copy-pasting individual tags, this extension extracts the metadata directly from the DOM, replaces booru formatting (like underscores) with WebUI-friendly spaces, and structures the prompt syntax specifically for target SDXL models.

## 🚀 Supported Models & Sites

**Supported Imageboards:**
* Rule34
* Gelbooru

**Supported SD Models:**
* **Pony Diffusion V6 XL:** Automatically prepends required quality/score tags and appends source/rating tags.
* **Animagine XL 4.0:** Automatically orders tags by hierarchy (Characters → Series → Artists/General) and appends required quality modifiers.

## ✨ Features
* **Zero-Friction Workflow:** Operates entirely via the right-click context menu.
* **DOM Tag Parsing:** Automatically categorizes character, copyright, artist, and general tags from the page.
* **Syntax Cleaning:** Strips out unwanted booru characters (`+`, `-`, `?`) and converts underscores (`_`) to spaces for better WebUI tokenization.
* **Instant Clipboard Export:** Formats the prompt and copies it straight to your clipboard, paired with a lightweight, non-intrusive UI toast notification.

## 🛠️ Installation (Brave / Chrome)

Since this is a local extension, you will need to load it via Developer Mode.

1. Clone or download this repository to a local folder on your machine.
2. Open your browser and navigate to the extensions page:
   * **Brave:** `brave://extensions/`
   * **Chrome:** `chrome://extensions/`
3. Toggle on **Developer mode** in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the folder containing the `manifest.json` file.

## 🖱️ Usage

1. Navigate to any individual image post on Rule34 or Gelbooru.
2. Right-click anywhere on the page.
3. Hover over **Export tags for Local SD**.
4. Select either **Import to Pony v6** or **Import to AnimagineXL40**.
5. A pink notification will appear in the bottom right corner confirming success.
6. Paste (`Ctrl+V`) directly into your Stable Diffusion WebUI prompt box.

## 📁 File Structure

* `manifest.json` - Extension configuration and permissions (Manifest V3).
* `background.js` - Service worker handling context menu creation, DOM injection, and clipboard operations.
