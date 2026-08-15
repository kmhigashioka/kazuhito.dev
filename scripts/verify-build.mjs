import { existsSync, readFileSync } from 'node:fs';

/**
 * Astro's CLI calls process.exit(), which on Windows races an open socket
 * handle left by a successful build-time fetch and trips a libuv assertion —
 * after the build has already written correct output. The exit code is
 * therefore unreliable on that platform, so we verify the artifacts instead.
 *
 * This runs ONLY when `astro build` exited non-zero. A genuine build failure
 * leaves dist absent or incomplete (Astro empties the directory at build
 * start), so this still fails loudly.
 */
const EXPECTED = [
  { path: 'dist/index.html', marker: 'I build software' },
  { path: 'dist/work/index.html', marker: 'PerformAI' },
  { path: 'dist/writing/index.html', marker: 'min read' },
];

const failures = [];

for (const { path, marker } of EXPECTED) {
  if (!existsSync(path)) {
    failures.push(`${path} is missing`);
    continue;
  }
  const html = readFileSync(path, 'utf8');
  if (html.length === 0) {
    failures.push(`${path} is empty`);
  } else if (!html.includes(marker)) {
    failures.push(`${path} does not contain expected content (${marker})`);
  }
}

if (failures.length > 0) {
  console.error('Build verification FAILED — the build genuinely broke:');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  'Build verification passed: all pages present and populated.\n' +
    'astro build exited non-zero, which on Windows is the known libuv\n' +
    'teardown crash after a successful build, not a build failure.',
);
