import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';

/**
 * Orchestrates `astro build` so that a non-zero exit code can be trusted
 * everywhere it matters, despite a Windows-only quirk that would otherwise
 * make it unreliable there. Two things this guarantees:
 *
 * 1. dist/ is removed before every build, unconditionally, on every
 *    platform. Astro's own build process empties dist/ too, but only
 *    inside the static-build phase, which runs AFTER config validation
 *    and content-collection loading. That means a failure earlier than
 *    that (a broken astro.config.mjs, a content-collection error, an
 *    integration throwing during setup) exits non-zero while leaving a
 *    stale dist/ from a previous successful build completely untouched.
 *    Removing dist/ ourselves, first, closes that gap: after this script
 *    runs, dist/ is either the fresh output of THIS build or genuinely
 *    absent/incomplete — never a leftover from an earlier run.
 *
 * 2. On Windows, `astro build` can crash on process exit due to a libuv
 *    teardown assertion after writing complete, correct output — see
 *    scripts/verify-build.mjs for the full explanation. That makes the
 *    exit code unreliable ONLY on Windows. Every other platform cannot
 *    hit that assertion, so there the exit code is trusted unconditionally
 *    and no artifact fallback runs.
 */

rmSync('dist', { recursive: true, force: true });

const build = spawnSync('astro', ['build'], { stdio: 'inherit', shell: true });
const exitCode = build.status ?? 1;

if (exitCode === 0) {
  process.exit(0);
}

if (process.platform !== 'win32') {
  // No libuv teardown crash possible here: a non-zero exit means the
  // build genuinely failed. Trust it as-is.
  process.exit(exitCode);
}

// Windows, non-zero exit: could be a genuine failure or the known libuv
// crash after a successful build. dist/ was removed before this run, so
// its current state tells the truth either way — verify by artifacts.
const verify = spawnSync(process.execPath, ['scripts/verify-build.mjs'], {
  stdio: 'inherit',
});
process.exit(verify.status ?? 1);
