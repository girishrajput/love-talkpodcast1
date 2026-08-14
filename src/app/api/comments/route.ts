import { NextResponse } from 'next/server';
import { getStoredEpisodes, saveStoredEpisodes } from '@/lib/data';
import { Comment } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { episode_id, user_name, user_email, rating, content } = body;

    if (!episode_id || !user_name || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const episodes = getStoredEpisodes();
    const episodeIndex = episodes.findIndex(e => e.id === episode_id);

    if (episodeIndex === -1) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      episode_id,
      user_name,
      user_email: user_email || '',
      user_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user_name)}`,
      rating: Number(rating) || 5,
      content,
      likes_count: 0,
      created_at: new Date().toISOString()
    };

    const targetEpisode = episodes[episodeIndex];
    targetEpisode.comments = [newComment, ...(targetEpisode.comments || [])];
    episodes[episodeIndex] = targetEpisode;

    saveStoredEpisodes(episodes);

    return NextResponse.json({ comment: newComment, success: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
