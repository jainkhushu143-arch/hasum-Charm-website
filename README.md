# Charm Curation

A standalone, responsive charm-curation website with four interactive product studios:

- Keychain
- Scarf
- Jeans brooch
- Bracelet

## What customers can do

- Choose a base before adding charms
- Browse charms by category
- Add charms one by one to a live preview
- Drag every charm into position
- Rotate or remove the selected charm
- Switch between an editable view and a clean final preview
- Save a curation privately in their browser
- Copy complete order details

All product and charm visuals are inline SVG. The site has no image-host dependency and does not require Google Drive, an API key or a build process.

## Run locally

Open `index.html` directly, or serve the folder with any static server:

```bash
npx serve .
```

## Deploy

### Netlify

Upload this folder or connect it as the repository root. The included `netlify.toml` publishes the folder directly with no build command.

### GitHub Pages

Commit all files to a repository, then enable GitHub Pages for the repository root.

## Files

- `index.html` — complete site structure and content
- `styles.css` — responsive editorial design and customizer layout
- `app.js` — product data, inline artwork and all customization interactions
- `netlify.toml` — static Netlify configuration
