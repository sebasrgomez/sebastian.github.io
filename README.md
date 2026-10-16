# Academic website (static, GitHub Pages)
Plain HTML/CSS/JS, no build step. All links are relative, so it works at `https://USERNAME.github.io` and `https://USERNAME.github.io/REPO/`.

## Deploy
1. Create a repo (`USERNAME.github.io` for a personal site, or any name for a project site) and upload all files to the root.
2. Settings → Pages → Deploy from a branch → `main` / root. Wait a minute.
3. Custom domain later: Settings → Pages → Custom domain, then add the DNS records GitHub lists.

## Edit content
- `data/site.json`: name, bio, email, social links, timeline, skills, CV (`cv_file`, e.g. `assets/cv.pdf` after you add the file).
- `data/publications.json`: add one object per paper; Home, Publications and CV all read it. Delete the example entry.
- `data/projects.json`, `data/posts.json`: same pattern.
- Preview locally: `python -m http.server`, then open http://localhost:8000.
- Update `sitemap.xml` with your real URLs.
