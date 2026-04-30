# Weather App — The Odin Project

[View it live](https://aurel-charles.github.io/weather-app-TOP/)

Vanilla JavaScript weather app built with Webpack 5. Search any city or use geolocation to get the current weather and a 7-day forecast, with a mood-matching GIF.

---

## APIs

| Service | Used for |
|---|---|
| [Visual Crossing](https://www.visualcrossing.com/) | Current weather + 7-day forecast |
| [Giphy](https://developers.giphy.com/) | Mood GIF based on weather conditions |
| [OpenStreetMap Nominatim](https://nominatim.org/) | Reverse geocoding for the geolocation button |

---

## Installation

```bash
git clone https://github.com/Aurel-Charles/weather-app-TOP.git
cd weather-app-TOP
npm install
```

Create a `.env` file at the project root:

```bash
cp .env.example .env
```

Fill in two keys:

- `OPENWEATHER_API_KEY` — your **Visual Crossing** API key (variable name kept for legacy reasons)
- `GIFY_API_KEY` — your **Giphy** API key

Nominatim does not require a key.

---

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build production assets to `/dist` |
| `npm run deploy` | Deploy to GitHub Pages (`gh-pages` branch) |

---

## Notes

- Weather icons are loaded via dynamic `import()` and code-split per chunk by Webpack.
- API keys are inlined into the bundle at build time. They are public on the deployed site — restrict them on each provider's dashboard if needed.
