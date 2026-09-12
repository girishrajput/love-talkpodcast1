import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { uploadMediaFile } from '@/lib/storage';

export const dynamic = 'force-dynamic';

// Maximum size limits
const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/x-mp3'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const uploadType = (formData.get('type') as string) || 'auto'; // 'audio', 'image', or 'auto'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const filename = file.name || 'unnamed_file';
    const ext = path.extname(filename).toLowerCase();
    const mimeType = file.type || '';
    const size = file.size;

    // Determine category: audio vs image
    const isAudio =
      uploadType === 'audio' ||
      ext === '.mp3' ||
      ALLOWED_AUDIO_TYPES.includes(mimeType);

    const isImage =
      uploadType === 'image' ||
      ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ||
      ALLOWED_IMAGE_TYPES.includes(mimeType);

    if (!isAudio && !isImage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file format. Only MP3 audio files and JPG/PNG/WebP image files are allowed.'
        },
        { status: 400 }
      );
    }

    // Strict validation by file type
    if (isAudio) {
      if (ext !== '.mp3' && !ALLOWED_AUDIO_TYPES.includes(mimeType)) {
        return NextResponse.json(
          { success: false, error: 'Invalid audio format. Only MP3 files (.mp3) are accepted.' },
          { status: 400 }
        );
      }
      if (size > MAX_AUDIO_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `Audio file exceeds maximum allowed size of 50MB (current size: ${(size / (1024 * 1024)).toFixed(1)}MB).`
          },
          { status: 400 }
        );
      }
    }

    if (isImage) {
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && !ALLOWED_IMAGE_TYPES.includes(mimeType)) {
        return NextResponse.json(
          { success: false, error: 'Invalid image format. Only JPG, JPEG, PNG, and WebP images are allowed.' },
          { status: 400 }
        );
      }
      if (size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `Image file exceeds maximum allowed size of 10MB (current size: ${(size / (1024 * 1024)).toFixed(1)}MB).`
          },
          { status: 400 }
        );
      }
    }

    // Generate unique, sanitized filename
    const sanitizedBase = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newFilename = `${isAudio ? 'audio' : 'cover'}_${sanitizedBase}_${uniqueSuffix}${ext}`;

    // Determine category and subfolder
    const subfolder = isAudio ? 'audio' : 'covers';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save via Storage Abstraction (Cloud S3/R2 or Local Fallback)
    const uploadResult = await uploadMediaFile({
      buffer,
      filename: newFilename,
      mimeType: isAudio ? 'audio/mpeg' : mimeType || 'image/jpeg',
      subfolder
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      filename: newFilename,
      originalName: filename,
      size,
      mimeType: isAudio ? 'audio/mpeg' : mimeType || 'image/jpeg',
      category: isAudio ? 'audio' : 'image',
      provider: uploadResult.provider
    });
  } catch (error: any) {
    console.error('File Upload Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
