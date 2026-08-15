import snapshot from '../content/devto-snapshot.json';

export interface Post {
  id: number;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  readingTimeMinutes: number;
  tags: string[];
  coverImage: string | null;
}

const ENDPOINT = 'https://dev.to/api/articles?username=kmhigashioka&per_page=30';
const TIMEOUT_MS = 5000;

const FALLBACK: Post[] = snapshot as Post[];

function toPost(raw: unknown): Post | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const a = raw as Record<string, unknown>;

  if (typeof a.id !== 'number') return null;
  if (typeof a.title !== 'string' || a.title.length === 0) return null;
  if (typeof a.url !== 'string' || a.url.length === 0) return null;

  return {
    id: a.id,
    title: a.title,
    description: typeof a.description === 'string' ? a.description : '',
    url: a.url,
    publishedAt: typeof a.published_at === 'string' ? a.published_at : '',
    readingTimeMinutes:
      typeof a.reading_time_minutes === 'number' ? a.reading_time_minutes : 1,
    tags: Array.isArray(a.tag_list)
      ? a.tag_list.filter((t): t is string => typeof t === 'string')
      : [],
    coverImage: typeof a.social_image === 'string' ? a.social_image : null,
  };
}

function normalise(raw: unknown): Post[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const posts: Post[] = [];
  for (const item of raw) {
    const post = toPost(item);
    if (post === null) return null;
    posts.push(post);
  }
  return posts;
}

/**
 * Fetches published dev.to posts at build time.
 *
 * Never throws and never returns an empty array. Any failure — non-OK status,
 * network error, timeout, malformed body, empty list — falls back to the
 * committed snapshot so the build cannot be broken by a third-party outage.
 */
export async function fetchPosts(fetchImpl: typeof fetch = fetch): Promise<Post[]> {
  try {
    const response = await fetchImpl(ENDPOINT, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) return FALLBACK;

    return normalise(await response.json()) ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
}
