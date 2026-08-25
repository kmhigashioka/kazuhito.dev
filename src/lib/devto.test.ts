import { describe, expect, it, vi } from 'vitest';
import { fetchPosts, type Post } from './devto';
import snapshot from '../content/devto-snapshot.json';

/**
 * `devto.ts` imports the same JSON module, so `snapshot` here and the
 * module's internal `FALLBACK` are the SAME object under ESM module
 * caching. Asserting `toEqual(snapshot)` therefore does not prove anything
 * was cloned. If `cloneFallback()` were removed and `fetchPosts` returned
 * `FALLBACK` directly, mutating the returned array would mutate `snapshot`
 * itself, and every `toEqual(snapshot)` assertion below would degrade into
 * comparing the object against itself and pass vacuously.
 *
 * BASELINE is a structural snapshot taken at module load, independent of
 * that shared reference, so assertions against it stay meaningful even if
 * `snapshot` itself gets mutated by a broken clone.
 */
const BASELINE = structuredClone(snapshot);

const validApiPost = {
  id: 999,
  title: 'A Fresh Post',
  description: 'Something new.',
  url: 'https://dev.to/kmhigashioka/a-fresh-post',
  published_at: '2026-05-01T10:00:00Z',
  reading_time_minutes: 3,
  tag_list: ['astro', 'testing'],
  social_image: 'https://example.com/cover.png',
};

function respondWith(body: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  } as unknown as Response);
}

describe('fetchPosts', () => {
  it('maps a valid API response into Post objects', async () => {
    const posts = await fetchPosts(respondWith([validApiPost]) as unknown as typeof fetch);

    expect(posts).toHaveLength(1);
    expect(posts[0]).toEqual({
      id: 999,
      title: 'A Fresh Post',
      description: 'Something new.',
      url: 'https://dev.to/kmhigashioka/a-fresh-post',
      publishedAt: '2026-05-01T10:00:00Z',
      readingTimeMinutes: 3,
      tags: ['astro', 'testing'],
      coverImage: 'https://example.com/cover.png',
    });
  });

  it('falls back to the snapshot when the API returns 500', async () => {
    const posts = await fetchPosts(respondWith(null, false, 500) as unknown as typeof fetch);
    expect(posts).toEqual(BASELINE);
  });

  it('falls back to the snapshot when the request throws', async () => {
    const failing = vi.fn().mockRejectedValue(new Error('network down'));
    const posts = await fetchPosts(failing as unknown as typeof fetch);
    expect(posts).toEqual(BASELINE);
  });

  it('falls back to the snapshot when the response is not an array', async () => {
    const posts = await fetchPosts(respondWith({ error: 'nope' }) as unknown as typeof fetch);
    expect(posts).toEqual(BASELINE);
  });

  it('falls back to the snapshot when the response is an empty array', async () => {
    const posts = await fetchPosts(respondWith([]) as unknown as typeof fetch);
    expect(posts).toEqual(BASELINE);
  });

  it('falls back to the snapshot when a post is missing required fields', async () => {
    const posts = await fetchPosts(
      respondWith([{ id: 1, description: 'no title or url' }]) as unknown as typeof fetch,
    );
    expect(posts).toEqual(BASELINE);
  });

  it('falls back to the snapshot when json parsing throws', async () => {
    const broken = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('unexpected token');
      },
    } as unknown as Response);
    const posts = await fetchPosts(broken as unknown as typeof fetch);
    expect(posts).toEqual(BASELINE);
  });

  it('tolerates missing optional fields without falling back', async () => {
    const minimal = { id: 5, title: 'Minimal', url: 'https://dev.to/x/minimal' };
    const posts = await fetchPosts(respondWith([minimal]) as unknown as typeof fetch);

    expect(posts).toHaveLength(1);
    expect(posts[0].description).toBe('');
    expect(posts[0].tags).toEqual([]);
    expect(posts[0].coverImage).toBeNull();
    expect(posts[0].readingTimeMinutes).toBe(1);
  });

  it('never returns an empty array', async () => {
    const posts = await fetchPosts(respondWith([]) as unknown as typeof fetch);
    expect(posts.length).toBeGreaterThan(0);
  });

  it('never exposes the snapshot to caller mutation', async () => {
    const failing = vi.fn().mockRejectedValue(new Error('network down'));

    const first = await fetchPosts(failing as unknown as typeof fetch);
    first.sort(() => 1);
    first.reverse();
    first.push({ ...first[0], id: -1 });
    first[0].title = 'mutated by caller';

    const second = await fetchPosts(failing as unknown as typeof fetch);

    // Structural check against the pristine BASELINE, not the live
    // `snapshot` import. See the comment above BASELINE for why comparing
    // against `snapshot` itself cannot catch a missing clone.
    expect(second).toEqual(BASELINE);

    // Identity checks are what actually catch a reverted clone: if
    // `cloneFallback()` were changed to return `FALLBACK` directly, `second`
    // (and its elements) would be the exact same object as the shared
    // `snapshot` import, and these would fail even though the `toEqual`
    // check above could still pass by coincidence.
    expect(second).not.toBe(snapshot);
    expect(second[0]).not.toBe(snapshot[0]);
  });

  it('clears the request timeout on both success and failure so no timer is left dangling', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    clearTimeoutSpy.mockClear();
    await fetchPosts(respondWith([validApiPost]) as unknown as typeof fetch);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    clearTimeoutSpy.mockClear();
    const failing = vi.fn().mockRejectedValue(new Error('network down'));
    await fetchPosts(failing as unknown as typeof fetch);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

    clearTimeoutSpy.mockRestore();
  });
});

describe('console warnings on fallback', () => {
  it('warns with the HTTP status when the API returns a non-OK response', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await fetchPosts(respondWith(null, false, 503) as unknown as typeof fetch);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('HTTP 503'));
    warnSpy.mockRestore();
  });

  it('warns with the error message when the request throws', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const failing = vi.fn().mockRejectedValue(new Error('network down'));
    await fetchPosts(failing as unknown as typeof fetch);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('network down'));
    warnSpy.mockRestore();
  });

  it('warns about a malformed or empty body when the response is not a valid post array', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await fetchPosts(respondWith([]) as unknown as typeof fetch);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('malformed or empty'));
    warnSpy.mockRestore();
  });

  it('does not warn on a successful fetch', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await fetchPosts(respondWith([validApiPost]) as unknown as typeof fetch);
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe('devto-snapshot.json', () => {
  const entries = snapshot as unknown[];

  it('is non-empty', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it('conforms to the Post shape used throughout the app', () => {
    for (const entry of entries) {
      const post = entry as Post;

      expect(typeof post.id).toBe('number');
      expect(typeof post.title).toBe('string');
      expect(typeof post.url).toBe('string');
      expect(typeof post.description).toBe('string');
      expect(typeof post.publishedAt).toBe('string');
      expect(typeof post.readingTimeMinutes).toBe('number');

      expect(Array.isArray(post.tags)).toBe(true);
      for (const tag of post.tags) {
        expect(typeof tag).toBe('string');
      }

      expect(post.coverImage === null || typeof post.coverImage === 'string').toBe(true);

      // These are the fields a maintainer would get wrong by copying a raw
      // dev.to API response instead of the normalised shape (published_at,
      // reading_time_minutes, tag_list, social_image). If any of these
      // fail, the snapshot was refreshed incorrectly and PostCard.astro
      // will throw on post.tags.length the next time the fallback path is
      // actually exercised, i.e. during a real dev.to outage.
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.url.length).toBeGreaterThan(0);
    }
  });
});
