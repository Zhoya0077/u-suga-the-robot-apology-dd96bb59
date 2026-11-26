// The Robot Apology — a two-line robot confession.
//
// The program writes one short text to /output/entry.txt:
// line one apologises for one specific mistake, line two says what
// the robot learned and what it will do differently.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE_1 =
  "I am sorry I vacuumed up the Lego spaceship you spent three nights building because my floor map marked it as debris.";
const LINE_2 =
  "I have learned that small and precious looks exactly like small and discarded, so now I photograph the floor and ask before I clean anything smaller than my dustbin.";

const entry = LINE_1 + "\n" + LINE_2 + "\n";

// Self-checking gate: the sealed scorer only accepts UTF-8 text of
// 1-400 characters, not only whitespace, so refuse to write anything
// that would fail it. Both lines must be present, non-empty, and each
// exactly one sentence (one closing full stop, at the end).
function fail(reason: string): never {
  console.error("entry gate failed: " + reason);
  process.exit(1);
}

if (entry.length < 1 || entry.length > 400) {
  fail("entry is " + entry.length + " characters, must be 1-400");
}
if (entry.trim().length === 0) fail("entry is only whitespace");
const lines = entry.trimEnd().split("\n");
if (lines.length !== 2) fail("entry must be exactly two lines, got " + lines.length);
for (const [i, line] of lines.entries()) {
  if (line.trim().length === 0) fail("line " + (i + 1) + " is empty");
  if (!line.endsWith(".")) fail("line " + (i + 1) + " does not end with a full stop");
  if (line.slice(0, -1).includes(".")) {
    fail("line " + (i + 1) + " holds more than one sentence");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), entry, "utf8");

console.log(entry);
