import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Comment } from '@/lib/types';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { user_name, user_email, content, rating = 5, user_avatar } = body;

    if (!user_name || !user_email || !content) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and comment content are required' },
        { status: 400 }
      );
    }

    // 1. Fetch Episode ID by Slug
    const episodeRows = await query<any[]>(
      `SELECT id FROM episodes WHERE slug = ? LIMIT 1`,
      [slug]
    );

    if (episodeRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Episode not found' }, { status: 404 });
    }

    const episodeId = episodeRows[0].id;
    const commentId = `c-${Date.now()}`;
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // 2. Insert Comment into MySQL
    await query(
      `INSERT INTO comments (id, episode_id, user_name, user_email, user_avatar, rating, content, likes_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        commentId,
        episodeId,
        user_name,
        user_email,
        user_avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
        rating,
        content,
        createdAt
      ]
    );

    const newComment: Comment = {
      id: commentId,
      episode_id: episodeId,
      user_name,
      user_email,
      user_avatar,
      rating,
      content,
      likes_count: 0,
      created_at: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error: any) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ success: false, error: 'Failed to save comment' }, { status: 500 });
  }
}
