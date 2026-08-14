import { NextResponse } from 'next/server';
import { getStoredEpisodes } from '@/lib/data';
import { hasPremiumAccess } from '@/lib/membership';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const episodes = getStoredEpisodes();
  const episode = episodes.find(e => e.id === params.id || e.slug === params.id);

  if (!episode) {
    return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
  }

  // If FREE episode, allow unrestricted access
  if (episode.access_type === 'FREE') {
    return NextResponse.json({
      accessGranted: true,
      audioUrl: episode.audio_url,
      previewOnly: false,
      duration: episode.audio_duration
    });
  }

  // For PREMIUM episode, check user authorization
  const isPremiumUser = hasPremiumAccess(userId);

  if (isPremiumUser) {
    return NextResponse.json({
      accessGranted: true,
      audioUrl: episode.audio_url,
      previewOnly: false,
      duration: episode.audio_duration
    });
  }

  // If unauthenticated or free user on PREMIUM episode, grant preview access only
  const previewLimit = episode.preview_duration || 60;

  return NextResponse.json(
    {
      accessGranted: false,
      audioUrl: episode.audio_url,
      previewOnly: true,
      previewDuration: previewLimit,
      message: 'Unlock Love Talk Premium to listen to the full episode.'
    },
    { status: 403 }
  );
}
