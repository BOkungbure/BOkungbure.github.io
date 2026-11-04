# Yomi Okungbure: personal website

A static career site (HTML, CSS and a little JavaScript) hosted free on GitHub Pages at
**https://bokungbure.github.io**.

| File | Page |
|---|---|
| `index.html` | About, experience, certifications, contact |
| `skills.html` | Programming languages and tools |
| `powerbi.html` | Embedded Power BI reports |
| `projects.html` | GitHub projects |
| `assets/` | Stylesheet, script, images and resume PDF |

## Preview locally

```bash
python -m http.server 8765
```

Then open http://localhost:8765.

## Publish (first time)

1. On GitHub, create a **public** repository named exactly `BOkungbure.github.io`, with no README.
2. In this folder, run:

   ```bash
   git init -b main
   git add .
   git commit -m "Initial website"
   git remote add origin https://github.com/BOkungbure/BOkungbure.github.io.git
   git push -u origin main
   ```

3. In the repository on GitHub, go to **Settings → Pages**, set the source to **Deploy from a branch**, then choose `main` and `/ (root)`.
4. After 1–2 minutes the site is live at https://bokungbure.github.io.

## Update the site

Edit the files, then run:

```bash
git add .
git commit -m "Describe the change"
git push
```

GitHub Pages redeploys automatically.

## Add a Power BI report

1. In the Power BI Service, open the report and choose **File → Embed report → Publish to web (public)**. Copy the `src` URL from the iframe code.
2. In `powerbi.html`, copy the block between `REPORT: Financial Dashboard` and `END REPORT`, paste it below, and change the title, description, tags, page cards and both `src` / `href` URLs.

Publish to web makes the report and its data **public**. Only use public or synthetic data.
