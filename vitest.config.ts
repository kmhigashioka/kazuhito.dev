/// <reference types="vitest/config" />
// Astro's Vite config, not a bare one: without the assets plugin, `import
// img from './x.png'` resolves to a plain string path here while resolving
// to ImageMetadata under `astro build`. Tests would then assert against a
// shape the real build never produces.
//
// The reference above is load-bearing for `astro check`: getViteConfig is
// typed against Vite's UserConfig, which has no `test` key until Vitest's
// module augmentation is pulled in.
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
