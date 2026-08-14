import { Episode, MembershipPlan, PremiumBenefit, Comment } from './types';
import { INITIAL_EPISODES, INITIAL_PLANS, INITIAL_BENEFITS } from './data';

/**
 * Fetch all episodes dynamically from MySQL API with no-cache headers
 */
export async function fetchEpisodes(options?: {
  search?: string;
  tag?: string;
  access_type?: string;
  language?: string;
  include_drafts?: boolean;
}): Promise<Episode[]> {
  try {
    const params = new URLSearchParams();
    if (options?.search) params.append('search', options.search);
    if (options?.tag && options.tag !== 'All') params.append('tag', options.tag);
    if (options?.access_type && options.access_type !== 'ALL') params.append('access_type', options.access_type);
    if (options?.language && options.language !== 'all') params.append('language', options.language);
    if (options?.include_drafts) params.append('include_drafts', 'true');

    const res = await fetch(`/api/episodes?${params.toString()}`, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (!res.ok) throw new Error('API request failed');
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.warn('Failed to fetch episodes from MySQL API, falling back to local dataset:', err);
    return INITIAL_EPISODES;
  }
}

/**
 * Fetch single episode details + comments by slug dynamically from MySQL API
 */
export async function fetchEpisodeBySlug(slug: string): Promise<Episode | null> {
  try {
    const res = await fetch(`/api/episodes/${slug}`, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    if (!res.ok) throw new Error('Episode API request failed');
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn(`Failed to fetch episode ${slug} from MySQL API:`, err);
    return INITIAL_EPISODES.find(e => e.slug === slug) || null;
  }
}

/**
 * Post a comment for an episode in MySQL
 */
export async function postEpisodeComment(
  slug: string,
  commentData: { user_name: string; user_email: string; content: string; rating: number; user_avatar?: string }
): Promise<Comment | null> {
  try {
    const res = await fetch(`/api/episodes/${slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    if (!res.ok) throw new Error('Failed to post comment');
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Comment API submission error:', err);
    return null;
  }
}

/**
 * Create a new Episode in MySQL
 */
export async function createEpisodeApi(episodeData: Partial<Episode>): Promise<boolean> {
  try {
    const res = await fetch('/api/episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(episodeData)
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (err) {
    console.error('Create episode API error:', err);
    return false;
  }
}

/**
 * Update an existing Episode in MySQL
 */
export async function updateEpisodeApi(episodeData: Partial<Episode>): Promise<boolean> {
  try {
    const res = await fetch('/api/episodes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(episodeData)
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (err) {
    console.error('Update episode API error:', err);
    return false;
  }
}

/**
 * Delete an Episode from MySQL
 */
export async function deleteEpisodeApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/episodes?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (err) {
    console.error('Delete episode API error:', err);
    return false;
  }
}

/**
 * Fetch membership plans and premium benefits from MySQL API
 */
export async function fetchMembershipPlans(): Promise<{ plans: MembershipPlan[]; benefits: PremiumBenefit[] }> {
  try {
    const res = await fetch(`/api/membership-plans`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Membership plans API failed');
    const json = await res.json();
    return json.success 
      ? { plans: json.plans || INITIAL_PLANS, benefits: json.benefits || INITIAL_BENEFITS }
      : { plans: INITIAL_PLANS, benefits: INITIAL_BENEFITS };
  } catch (err) {
    console.warn('Failed to fetch membership plans from MySQL API, falling back to local dataset:', err);
    return { plans: INITIAL_PLANS, benefits: INITIAL_BENEFITS };
  }
}

/**
 * Subscribe email to newsletter
 */
export async function subscribeNewsletterApi(email: string, name?: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (err) {
    console.error('Subscriber API error:', err);
    return false;
  }
}
