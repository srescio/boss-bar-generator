# Boss Bar Generator

A web app to generate boss bar overlays for games (e.g., Minecraft, WoW, FF). Select a style, input up to 3 text fields, choose a background, and download the result as a PNG with alpha transparency.

## Features
- Select game style (Minecraft, WoW, FF)
- Input up to 3 text fields
- Select background color (or transparent)
- Live preview on canvas
- Download as PNG (with alpha)
- Fields persist via localStorage (with clear/reset option)
- SPA: No backend required for production

## Usage

### Local Development

```
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

### Production Build

```
npm run build
```

The static files will be in the `build/` directory. Upload the contents of `build/` to your LAMP (Apache) web hosting or subdomain (e.g., `bossbar.simonerescio.it`). No Node.js server is required for production.

## License
MIT

---
Made by [Simone Rescio](https://simonerescio.it)
