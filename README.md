# joshuawang.app

Personal storytelling website for Joshua Wang. Single page, five narrative
chapters, fully static output suitable for GitHub Pages.

- TanStack Start (prerendered to static files)
- React, TypeScript, Tailwind CSS
- Photos in `public/photos`, research poster in `public/documents`

## Development

Requires [Bun](https://bun.sh).

```sh
bun install
bun run dev     # local dev server
bun run build   # production build, static output in dist/client
```

## Deployment to GitHub Pages

1. In Lovable, open the project and connect it to GitHub (top right, GitHub).
   Every change made in Lovable is then committed to that repository.
2. In the GitHub repository, open Settings, Pages, and under "Build and
   deployment" set Source to **GitHub Actions**. The workflow in
   `.github/workflows/deploy-pages.yml` installs with the committed lockfile,
   runs `bun run build`, and uploads `dist/client`.
3. Push to `main` (or run the workflow manually) and wait for the
   "Deploy to GitHub Pages" run to finish.
4. In Settings, Pages, Custom domain, enter `joshuawang.app` and save. The
   repository already contains `public/CNAME` with that value, so the build
   keeps the domain configured. Leave "Enforce HTTPS" enabled once the
   certificate is issued.

## DNS at Name.com

Configure DNS only after the repository exists and GitHub Pages has shown you
the target hostname for the site. GitHub's Pages settings page and its
"Managing a custom domain" documentation list the exact A, AAAA, or CNAME
values to use for an apex domain such as `joshuawang.app`. Copy those values from
GitHub, then in Name.com open Manage DNS Records for `joshuawang.app` and add
them. Do not guess the records ahead of time.

After DNS propagates, GitHub Pages will validate the domain and issue the
certificate, and the site will be live at https://joshuawang.app/.
