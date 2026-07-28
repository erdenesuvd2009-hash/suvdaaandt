# Your skincare review site — setup guide

## Step 1 — Upload to GitHub

Your repo is already created: **erdenesuvd2009-hash/suvdaaandt**

1. Open it on GitHub and click **uploading an existing file**.
2. Drag in the contents of this folder: `src`, `package.json`,
   `eleventy.config.js`, `netlify.toml`, `README.md`.
   Drag the *contents*, not the outer folder.
3. Scroll down and click **Commit changes**.

> `.gitignore` starts with a dot so Finder hides it. It's optional — press
> **⌘ + Shift + .** in Finder to reveal it if you want to include it.

---

## Step 2 — CMS configuration ✅ already done

`src/admin/config.yml` is already pointed at your repository:

```yaml
repo: erdenesuvd2009-hash/suvdaaandt
branch: main
```

Nothing to change. (If you ever rename the repo, this is the line to update.)

---

## Step 3 — Put it online with Netlify

Netlify is free, connects to your domain, and rebuilds the site automatically
every time you publish a review.

1. Go to [netlify.com](https://www.netlify.com) and sign up **with GitHub**.
2. Click **Add new site** → **Import an existing project** → **GitHub**.
3. Pick the `suvdaaandt` repository.
4. Netlify reads `netlify.toml` and fills in the settings for you. Confirm they say:
   - Build command: `npm run build`
   - Publish directory: `_site`
5. Click **Deploy**.

After a minute or two you'll get a temporary address like
`glowing-macaron-123.netlify.app`. Open it — your site is live.

### Connect your domain

1. In Netlify: **Domain management** → **Add a domain** → type your domain.
2. Netlify shows you either nameservers or DNS records.
3. Log in wherever you bought the domain and enter what Netlify gave you.
4. Wait — usually under an hour, occasionally up to 24. HTTPS is set up
   automatically and free.

---

## Step 4 — Log in and write

Go to **yourdomain.com/admin/**.

Click **Sign in with Token**. A box appears with a link to GitHub that has the
right permissions already selected — click it, generate the token, copy it, and
paste it back into the box.

That's it. From now on you just visit `/admin/`, write, and hit **Publish**.
Netlify rebuilds the site by itself in about a minute.

> **Keep the token private.** It gives full access to your repository. If you
> ever paste it somewhere by accident, delete it at
> github.com → Settings → Developer settings → Personal access tokens.

---

## Writing a review

In `/admin/` click **Reviews** → **New Review**. The form has:

| Field | What it does |
|---|---|
| Product name, Brand | The title and the small label above it |
| Category / Product type | Where it files itself in the menu |
| Rating | The stars, in halves (3.5, 4, 4.5…) |
| Main photo | Big image at the top and on the listing card |
| One-line summary | The teaser shown on cards |
| Skin types | The little tags |
| Price, Size, Ingredients, Where to buy | The **Product details** box |
| Pros / Cons | The green and pink panels |
| The review | Your actual writing |
| Final verdict | The highlighted box at the end |
| Save as draft | Tick this to hide it from the site |

Every field except the product name, category, type and review body is optional
— leave anything blank and that part simply won't appear.

---

## Adding new categories later

The menu builds itself from your reviews, so nothing on the site needs editing.
You only add the option to the CMS form:

**To add a product type** (e.g. "Sleeping Mask") — open `src/admin/config.yml`,
find the `Product type` list, and add one line:

```yaml
      - Sleeping Mask
```

**To add a whole new category** (e.g. "Haircare") — add it to the `Category`
list the same way, then add its product types to the `Product type` list.

A category or type appears in the site menu as soon as one published review uses
it, and disappears if nothing uses it. No empty pages.

---

## Changing the site name and tagline

Open `src/_data/site.js` on GitHub, click the pencil, edit the text in quotes,
commit. **Change `url` to your real domain** — it's used for Google and link
previews.

## Changing the colours

Open `src/css/style.css`. The first block, `:root { … }`, holds every colour on
the site. Change `--pink` and `--blush` and the whole site follows.

---

## Housekeeping

- **Delete the three sample reviews** in `src/reviews/` once you've written your
  own — in `/admin/`, open each one and click **Delete**.
- Photos you upload live in `src/uploads/`.

## Running it on your own computer (optional)

Only if you want to preview changes before publishing. Install
[Node.js](https://nodejs.org), then in this folder:

```bash
npm install
npm start
```

Open http://localhost:8080.

---

## If something breaks

**The site won't build after I edited a file.** In Netlify, open **Deploys** →
click the failed deploy → read the red line at the bottom. It usually names the
file. Undo your last edit on GitHub and it will rebuild.

**The admin page is blank.** Check `repo:` in `src/admin/config.yml` matches
your repository, and that the branch name is right.

**A review doesn't appear.** Check that "Save as draft" is unticked, and that it
has a category.
