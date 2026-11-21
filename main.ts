// gta6-clipper-01 entrypoint (Node 22, standard library only).
//
// The entry itself is the YouTube video: a vertical GTA 6 clip that pitches
// make.fun to its viewers. This program's only job is to hand the house the
// video's address, by copying VIDEO.json from the repository root into the
// output directory where the grader reads it. Nothing else is written.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const sourceDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(sourceDir, 'VIDEO.json');
const target = join(outputDir, 'VIDEO.json');

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`could not copy VIDEO.json from ${source}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`VIDEO.json copied to ${target}`);
