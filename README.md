# Wazo

The honest receipt for your startup idea. Hebrew and English, mobile first.

Type an idea, get a smart analysis: four scores with evidence grades, the money in three scenarios, a 7-day test, and a verdict: BUILD, PIVOT or KILL.

## Where it lives

- **Live app (runs the analysis):** claude.ai artifact, runs on the viewer's Claude account
- **Showcase:** https://wazo-il.vercel.app (Vercel project `wazo`). Pressing "Analyze" opens the live app.

## Folder

- `site/` is what Vercel serves: `index.html` (the whole app, one file) and `vercel.json`
- `versions/` keeps numbered snapshots, `wazo-index-vNN.html`
- `data/` is for local exports (leads CSV). It is git-ignored on purpose: emails never go into the repo.

## Deploy

Vercel builds `site/` on every push to `main`. Manual deploy:

```
cd site
npx vercel link --project wazo
npx vercel --prod
```

## Modes

- **Free:** scores and money open, sign up free to see the verdict, 7-day test and fine print are Pro
- **Pro:** everything open, plus "Upgrade to Teams" for accelerators and programs
- The owner sees a FREE/PRO preview switch in the top bar

Built by WAZO.
