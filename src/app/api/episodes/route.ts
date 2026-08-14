import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Episode } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const accessType = searchParams.get('access_type') || '';
    const language = searchParams.get('language') || '';
    const includeDrafts = searchParams.get('include_drafts') === 'true';
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    let sql = `SELECT * FROM episodes WHERE 1=1`;
    const params: any[] = [];

    if (!includeDrafts) {
      sql += ` AND (is_published = TRUE OR is_published = 1 OR is_published IS NULL)`;
    }

    if (search) {
      sql += ` AND (title LIKE ? OR description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (accessType && accessType !== 'ALL') {
      sql += ` AND access_type = ?`;
      params.push(accessType);
    }

    if (language && language !== 'all') {
      sql += ` AND language = ?`;
      params.push(language);
    }

    sql += ` ORDER BY episode_number DESC LIMIT ?`;
    params.push(limit);

    const rows = await query<any[]>(sql, params);

    // Format MySQL rows to Episode objects (parse JSON fields)
    const episodes: Episode[] = rows.map((row) => ({
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
    }));

    // Client-side tag filtering if tag parameter is passed (since tags stored in JSON)
    const filteredEpisodes = tag && tag !== 'All' 
      ? episodes.filter(ep => ep.tags.includes(tag))
      : episodes;

    return NextResponse.json(
      { success: true, count: filteredEpisodes.length, data: filteredEpisodes },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error: any) {
    console.error('Error fetching episodes:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch episodes from database' }, { status: 500 });
  }
}

// POST: Create a new Episode in MySQL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      episode_number,
      slug,
      description,
      audio_url,
      audio_duration,
      cover_image,
      language = 'english',
      tags = [],
      access_type = 'FREE',
      preview_duration = 60,
      transcript_en,
      transcript_hi,
      is_published = true
    } = body;

    if (!title || !slug || !audio_url) {
      return NextResponse.json({ success: false, error: 'Title, slug, and audio_url are required' }, { status: 400 });
    }

    const id = `ep-${Date.now()}`;
    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const epNum = episode_number || (Date.now() % 10000);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await query(
      `INSERT INTO episodes (
        id, title, episode_number, slug, description, audio_url, audio_duration,
        cover_image, language, tags, publish_date, is_published, access_type,
        preview_duration, transcript_en, transcript_hi, listens_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        id,
        title,
        epNum,
        cleanSlug,
        description || title,
        audio_url,
        audio_duration || 1800,
        cover_image || '/images/podcast_cover.jpg',
        language,
        JSON.stringify(tags),
        now,
        is_published ? 1 : 0,
        access_type,
        preview_duration,
        transcript_en || null,
        transcript_hi || null
      ]
    );

    return NextResponse.json({ success: true, message: 'Episode created successfully in MySQL', id, slug: cleanSlug });
  } catch (error: any) {
    console.error('Error creating episode in MySQL:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create episode' }, { status: 500 });
  }
}

// PUT: Update an existing Episode in MySQL
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, episode_number, slug, description, audio_url, audio_duration, cover_image, language, tags, is_published, access_type, transcript_en, transcript_hi } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Episode ID is required' }, { status: 400 });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await query(
      `UPDATE episodes SET
        title = COALESCE(?, title),
        episode_number = COALESCE(?, episode_number),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        audio_url = COALESCE(?, audio_url),
        audio_duration = COALESCE(?, audio_duration),
        cover_image = COALESCE(?, cover_image),
        language = COALESCE(?, language),
        tags = COALESCE(?, tags),
        is_published = COALESCE(?, is_published),
        access_type = COALESCE(?, access_type),
        transcript_en = COALESCE(?, transcript_en),
        transcript_hi = COALESCE(?, transcript_hi),
        updated_at = ?
       WHERE id = ?`,
      [
        title || null,
        episode_number || null,
        slug ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : null,
        description || null,
        audio_url || null,
        audio_duration || null,
        cover_image || null,
        language || null,
        tags ? JSON.stringify(tags) : null,
        is_published !== undefined ? (is_published ? 1 : 0) : null,
        access_type || null,
        transcript_en || null,
        transcript_hi || null,
        now,
        id
      ]
    );

    return NextResponse.json({ success: true, message: 'Episode updated successfully in MySQL' });
  } catch (error: any) {
    console.error('Error updating episode in MySQL:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update episode' }, { status: 500 });
  }
}

// DELETE: Remove an Episode from MySQL
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Episode ID is required' }, { status: 400 });
    }

    await query(`DELETE FROM episodes WHERE id = ?`, [id]);
    return NextResponse.json({ success: true, message: 'Episode deleted from MySQL database' });
  } catch (error: any) {
    console.error('Error deleting episode:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete episode' }, { status: 500 });
  }
}
