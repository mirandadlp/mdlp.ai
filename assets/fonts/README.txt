Neue Montreal — hero accent word
================================

The word "Transformation" in the hero is set in Neue Montreal.

Neue Montreal is a COMMERCIAL font from Pangram Pangram:
    https://pangrampangram.com/products/neue-montreal
It can't be served from a free CDN, so it isn't bundled here. Once you have
a licensed copy (a webfont licence covers hosting it on your own site),
drop the files into THIS folder with these exact names:

    NeueMontreal-Bold.woff2      <- used by the hero word (weight 700)
    NeueMontreal-Bold.woff       <- optional older-browser fallback
    NeueMontreal-Medium.woff2    <- optional (weight 500)
    NeueMontreal-Regular.woff2   <- optional (weight 400)

That's it — the @font-face rules are already in styles.css (and in the
inlined CSS in mdlp-portfolio.html), so the site picks the files up
automatically with no code changes.

Only have .otf/.ttf? Convert them to .woff2 first — for example with
https://transfonter.org — which is smaller and faster on the web.

UNTIL THOSE FILES EXIST
-----------------------
The font stack falls back to Space Grotesk (loaded from Google Fonts),
the closest freely-hostable neo-grotesque, then to Inter. The site looks
intentional either way — nothing breaks while the folder is empty.

If you'd rather not license Neue Montreal, tell Claude and the fallback
can be swapped for a different free face.
