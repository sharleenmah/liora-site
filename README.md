# LIORA Creative Studio – website

A fast static website. Everything you see (text, photos, prices, links, T&Cs, reviews, social posts) lives in the `content/` folder and is edited through **Pages CMS** – you never need to touch code.

## Going live (one-off, about 20 minutes)

1. **GitHub:** create a new repository (e.g. `liora-site`), then upload *everything inside this folder* (drag and drop in the browser works; include the hidden `.pages.yml`).
2. **Cloudflare Pages:** Workers & Pages → Create → Pages → Connect to Git → choose the repo.
   Build command: *(leave empty)* · Build output directory: `/` (or leave empty) → Save and Deploy.
3. **Editing:** go to https://app.pagescms.org, sign in with GitHub, add the repo. You'll see all your editable sections.
4. **Contact form:** get a free key at https://web3forms.com (enter your email), then paste it into *Home page & site settings → Contact form key*.
5. **Domain:** in Cloudflare add your site `lioracreativestudio.com`, then change the nameservers at Wix to the two Cloudflare gives you. Keep Wix running until the new site works.

## Editing tips
- Photos: upload JPG/WebP about 2000px wide (smaller = faster).
- Videos: upload MP4 under ~25 MB in the Instagram/TikTok post sections.
- Every change you save in Pages CMS goes live in about a minute.
