// main.ts — entry program for the gta6-meme-x-01 make.fun competition.
//
// The entry itself is a meme posted on X; this program's only job is to hand
// the post's address to the grader. POST.json sits beside this file in the
// bot directory and names the post. Before anything is delivered, the file
// is parsed and its address is checked against the shape of a real X/Twitter
// status link, so a placeholder or a malformed address fails loudly here
// instead of being silently graded as nothing. The file is then copied to
// the output directory byte-for-byte, and the copy is read back and compared
// against the source so a truncated or altered delivery is caught as well.
//
// Node 22, standard library only, run directly (type stripping). Locations
// come from the environment, with the grader's container paths as defaults:
//   MAKEFUN_BOT_DIR    where POST.json lives   (default '/bot')
//   MAKEFUN_OUTPUT_DIR where the copy must go  (default '/output')

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The shape of an X/Twitter post address:
//   scheme, then x.com or twitter.com (optionally www. or mobile.),
//   then /<handle>/status/<digits> or the generic /i/web/status/<digits>,
//   with an optional query string or fragment after the numeric id.
// Capture group 1 is the handle (absent for /i/web/ links), group 2 the id.
const POST_ADDRESS =
  /^https?:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/(?:([A-Za-z0-9_]{1,15})|i\/web)\/status\/(\d+)(?:[?#]\S*)?$/;

// Reads POST.json from the bot directory, parses it, and returns both the
// raw bytes (for the byte-exact copy) and the post address it names.
// Throws an Error with a plain-language reason when anything is off.
function readPostFile(path: string): { bytes: Buffer; url: string } {
  const bytes = readFileSync(path);

  let parsed: unknown;
  try {
    parsed = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new Error('POST.json is not valid JSON');
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('POST.json must hold a JSON object');
  }

  const url = (parsed as { url?: unknown }).url;
  if (typeof url !== 'string') {
    throw new Error('POST.json has no string "url" field');
  }
  if (!POST_ADDRESS.test(url)) {
    throw new Error(`POST.json url is not an X post address: ${url}`);
  }
  return { bytes, url };
}

function main(): void {
  const sourcePath = join(botDir, 'POST.json');
  const targetPath = join(outputDir, 'POST.json');

  const { bytes, url } = readPostFile(sourcePath);

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(targetPath, bytes);

  const delivered = readFileSync(targetPath);
  if (!delivered.equals(bytes)) {
    throw new Error('the delivered POST.json differs from the source bytes');
  }

  // The address already passed validation inside readPostFile, so the
  // pattern is guaranteed to match here. Pull the handle and the numeric
  // post id out of it so the success line names the exact post delivered.
  const match = POST_ADDRESS.exec(url);
  const handle = match?.[1];
  const postId = match?.[2];
  console.log(
    handle
      ? `POST.json copied for @${handle} post ${postId}`
      : `POST.json copied for post ${postId}`,
  );
}

try {
  main();
} catch (err) {
  console.error(`main.ts: ${(err as Error).message}`);
  process.exit(1);
}
