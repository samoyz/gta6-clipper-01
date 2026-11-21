// gta6-clipper-01 entrypoint (Node 22, standard library only).
//
// The entry itself is the YouTube video: a vertical GTA 6 clip that pitches
// make.fun to its viewers. This program's only job is to hand the house the
// video's address, by copying VIDEO.json from the repository root into the
// output directory where the grader reads it. Nothing else is written.
//
// Before copying, it checks VIDEO.json is a readable JSON object whose url
// is a non-empty https address, so a broken link file fails loudly here
// instead of reaching the grader.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const sourceDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(sourceDir, 'VIDEO.json');
const target = join(outputDir, 'VIDEO.json');

function fail(message: string): never {
  console.error(`VIDEO.json is not usable: ${message}`);
  process.exit(1);
}

let videoUrl: string;
try {
  const parsed: unknown = JSON.parse(readFileSync(source, 'utf8'));
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    fail('the file is not a JSON object');
  }
  const url = (parsed as { url?: unknown }).url;
  if (typeof url !== 'string' || url.length === 0) {
    fail('it has no url field, or the url is not a string');
  }
  if (!url.startsWith('https://')) {
    fail(`its url does not start with https:// (${url})`);
  }
  videoUrl = url;
} catch (err) {
  if (err instanceof SyntaxError) {
    fail(`it is not valid JSON (${err.message})`);
  }
  if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
    fail(`the file was not found at ${source}`);
  }
  throw err;
}

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`could not copy VIDEO.json from ${source}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`VIDEO.json copied to ${target} (url: ${videoUrl})`);
