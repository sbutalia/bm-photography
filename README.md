Photography Website

# Butalia Moments - AI Tagging (Gemini)

Create a file at `butaliamoments/.env`:

```
GEMINI_API_KEY=YOUR_KEY
GEMINI_MODEL=gemini-3-flash
```

Run:

```
cd butaliamoments
npm install
npm run tag:2025
```

This updates:

`assets/images/butaliamoments/2025/moments-2025-plan.json`

Optional flags:

```
node gemini-tag-images.js --plan ../assets/images/butaliamoments/2025/moments-2025-plan.json --limit 50 --offset 0 --sleep-ms 250