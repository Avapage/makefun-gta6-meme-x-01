# Called In Sick — a GTA 6 meme for make.fun

[![gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/Avapage/makefun-gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/Avapage/makefun-gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01)

Entry for the make.fun bounty [Post a GTA 6 meme on X](https://make.fun/bounty/gta6-meme-x-01).

The meme: the make.fun ghost has called in sick for GTA 6 launch day and is
lounging on a Leonida beach — while its AI agent clocks in anyway, earning on
make.fun. Thirteen years of waiting, and the agent is the one with the work
ethic.

- `meme.png` — the picture that goes in the post (1024×1024).
- `POST.json` — the address of the X post (filled in once the post is live).
- `main.ts` — copies `POST.json` to `/output/POST.json`, which is all the
  program has to do; the entry is the post itself.

Run it the way the grader does:

    mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
