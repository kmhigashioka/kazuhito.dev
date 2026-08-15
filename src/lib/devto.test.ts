import { describe, expect, it, vi } from 'vitest';
import { fetchPosts } from './devto';
import snapshot from '../content/devto-snapshot.json';

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
    expect(posts).toEqual(snapshot);
  });

  it('falls back to the snapshot when the request throws', async () => {
    const failing = vi.fn().mockRejectedValue(new Error('network down'));
    const posts = await fetchPosts(failing as unknown as typeof fetch);
    expect(posts).toEqual(snapshot);
  });

  it('falls back to the snapshot when the response is not an array', async () => {
    const posts = await fetchPosts(respondWith({ error: 'nope' }) as unknown as typeof fetch);
    expect(posts).toEqual(snapshot);
  });

  it('falls back to the snapshot when the response is an empty array', async () => {
    const posts = await fetchPosts(respondWith([]) as unknown as typeof fetch);
    expect(posts).toEqual(snapshot);
  });

  it('falls back to the snapshot when a post is missing required fields', async () => {
    const posts = await fetchPosts(
      respondWith([{ id: 1, description: 'no title or url' }]) as unknown as typeof fetch,
    );
    expect(posts).toEqual(snapshot);
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
    expect(posts).toEqual(snapshot);
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
});
