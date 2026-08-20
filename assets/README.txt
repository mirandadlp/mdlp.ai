Header background video
=======================

Put your video file here and name it:

    background.mp4

It plays fullscreen behind the header/hero (the first screenful) and
scrolls away with the page. The intro typewriter animation plays over it
on load. If the file is missing or can't play, the dark starfield
background shows instead — nothing looks broken.

IMPORTANT: the file must be a real MP4 video (H.264). A Mux HLS manifest
(a small text playlist saved as ".mp4") will NOT play in browsers. If your
video is on Mux: enable "static renditions" (MP4 support) in the Mux
dashboard, download the actual .mp4, and drop it here with this filename.

Tips:
- Keep it muted-friendly (it autoplays muted and loops).
- Compress it (ideally < ~10 MB) so the page loads fast.
- Want a different name or format? Update the
  <source src="assets/background.mp4"> line in index.html
  (and the same line in mdlp-portfolio.html).
