<p align="center"><img src="target/shared/icons/logo.svg" width="96" alt=""></p>

<h1 align="center">Distraction-Free Tab</h1>

<p align="center">A calm new tab page for Firefox that keeps distractions away.</p>

Distraction-Free Tab is a fork of [Tabliss](https://github.com/joelshepherd/tabliss) by Joel Shepherd.
It keeps the minimal new tab (Unsplash photos, clock, greeting, quick links, search) and adds:

- **Site blocking on a schedule**: pick sites, days and hours (ranges can run past midnight).
- **Daily limits**: minutes per site per day, counted only while the tab is active and you're there.
- **Block now**: block every site from your rules for 25 min, 1 h, 2 h or until you turn it off.
- **Friction instead of walls**: to unlock a site for 5 minutes, end a block-now session early or
  loosen your rules, you type a phrase (pasting doesn't work) or wait 30 seconds. Overrides are counted.
- **Timer**: a simple countdown that keeps running with the tab closed, with the minutes left on the toolbar icon.
- **41 languages**, including right-to-left support for Arabic, Persian and Hebrew.

Everything stays in your browser. Nothing is sent anywhere except the photo requests to Unsplash.

## Build

Requires Node.js. Install dependencies with `npm install`, then:

- `npm run build:firefox` builds the extension into `dist/firefox`
- `npm run dev:web` runs the new tab as a local web page (extension features are disabled there)
- `npm test` runs the unit tests
- `npm run icons` regenerates the PNG icons from `target/shared/icons/logo.svg`

Copy `.env.example` to `.env` and fill in your own keys:

- `UNSPLASH_API_KEY`: an [Unsplash](https://unsplash.com/developers) access key for the photo background
- `WEB_EXT_API_KEY` and `WEB_EXT_API_SECRET`: optional, [addons.mozilla.org API credentials](https://addons.mozilla.org/developers/addon/api/key/)
  to sign the extension with `npx web-ext sign --channel unlisted --source-dir dist/firefox`

## License

GPL-3.0, like Tabliss. See [LICENSE.txt](LICENSE.txt).
