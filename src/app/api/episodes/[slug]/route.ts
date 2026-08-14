import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Episode, Comment } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Episode slug is required' }, { status: 400 });
    }

    // 1. Fetch Episode by Slug
    const episodeRows = await query<any[]>(
      `SELECT * FROM episodes WHERE slug = ? AND is_published = TRUE LIMIT 1`,
      [slug]
    );

    if (episodeRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Episode not found' }, { status: 404 });
    }

    const row = episodeRows[0];

    // 2. Fetch Comments for this Episode
    const commentRows = await query<any[]>(
      `SELECT * FROM comments WHERE episode_id = ? ORDER BY created_at DESC`,
      [row.id]
    );

    const comments: Comment[] = commentRows.map((c) => ({
      id: c.id,
      episode_id: c.episode_id,
      user_name: c.user_name,
      user_email: c.user_email,
      user_avatar: c.user_avatar || undefined,
      rating: c.rating || 5,
      content: c.content,
      likes_count: c.likes_count || 0,
      created_at: c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString(),
    }));

    const episode: Episode = {
      id: row.id,
      title: row.title,
      episode_number: row.episode_number,
      slug: row.slug,
      description: row.description,
      audio_url: row.audio_url,
      audio_duration: row.audio_duration,
      cover_image: row.cover_image,
      language: row.language,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
      publish_date: row.publish_date ? new Date(row.publish_date).toISOString() : new Date().toISOString(),
      is_published: Boolean(row.is_published),
      access_type: row.access_type,
      preview_duration: row.preview_duration,
      transcript_en: row.transcript_en,
      transcript_hi: row.transcript_hi,
      listens_count: row.listens_count || 0,
      comments: comments
    };

    return NextResponse.json({ success: true, data: episode });
  } catch (error: any) {
    console.error('Error fetching episode by slug:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch episode details' }, { status: 500 });
  }
}
