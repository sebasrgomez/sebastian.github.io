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

## Update (ES/EN/한국어)
- UI/biography/education/methods text: `data/i18n.json` (en, es, ko). Add a method or interest by adding an entry to its list in each language.
- Photo: put `assets/photo.jpg` (4:5). CV: put `assets/cv.pdf`. Buttons activate automatically when the files exist.
- Selected Publications: set `"selected": true` on the two most-cited entries in `data/publications.json` after verifying citations from one source.
- Tutorials: add objects to `data/tutorials.json` (`title`/`desc` as `{en,es,ko}`, `category`, `date`, `minutes`).
- Contact: fill `email` and `social` in `data/site.json`.
