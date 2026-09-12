import { mkdir, writeFile, readFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export interface StorageUploadOptions {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  subfolder: 'audio' | 'covers' | 'misc';
}

export interface StorageUploadResult {
  url: string;
  key: string;
  provider: 'local' | 's3' | 'r2';
  publicUrl: string;
}

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || (process.env.S3_BUCKET_NAME ? 's3' : process.env.R2_BUCKET_NAME ? 'r2' : 'local');
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || process.env.R2_BUCKET_NAME || '';
const S3_REGION = process.env.S3_REGION || 'auto';
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '';
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '';
const S3_ENDPOINT = process.env.S3_ENDPOINT || process.env.R2_ENDPOINT || '';
const STORAGE_PUBLIC_DOMAIN = process.env.STORAGE_PUBLIC_DOMAIN || process.env.NEXT_PUBLIC_STORAGE_CDN_URL || '';

/**
 * Check if Cloud Storage (S3 / Cloudflare R2) is fully configured
 */
export function isCloudStorageConfigured(): boolean {
  return Boolean(
    (STORAGE_PROVIDER === 's3' || STORAGE_PROVIDER === 'r2') &&
    S3_BUCKET_NAME &&
    S3_ACCESS_KEY_ID &&
    S3_SECRET_ACCESS_KEY
  );
}

/**
 * Upload a file to Cloud Storage (S3/R2) or Local Disk fallback
 */
export async function uploadMediaFile({
  buffer,
  filename,
  mimeType,
  subfolder
}: StorageUploadOptions): Promise<StorageUploadResult> {
  const key = `${subfolder}/${filename}`;

  // 1. Cloud Storage Path (S3 / Cloudflare R2)
  if (isCloudStorageConfigured()) {
    try {
      const endpoint = S3_ENDPOINT || `https://s3.${S3_REGION}.amazonaws.com`;
      const urlHost = S3_ENDPOINT ? new URL(S3_ENDPOINT).host : `${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com`;
      const uploadUrl = `https://${urlHost}/${key}`;

      // Sign request using AWS SigV4
      const headers = createSigV4Headers({
        method: 'PUT',
        url: uploadUrl,
        headers: {
          'content-type': mimeType,
          'host': urlHost,
        },
        payload: buffer,
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
        region: S3_REGION,
        service: 's3'
      });

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': mimeType
        },
        body: new Uint8Array(buffer)
      });

      if (!response.ok) {
        throw new Error(`Cloud storage upload failed with status ${response.status}: ${await response.text()}`);
      }

      const publicUrl = STORAGE_PUBLIC_DOMAIN
        ? `${STORAGE_PUBLIC_DOMAIN.replace(/\/$/, '')}/${key}`
        : uploadUrl;

      return {
        url: publicUrl,
        key,
        provider: STORAGE_PROVIDER as 's3' | 'r2',
        publicUrl
      };
    } catch (err: any) {
      console.error('[Cloud Storage Error] Falling back to local disk upload:', err.message);
    }
  }

  // 2. Local Disk Fallback Path
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subfolder);
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  const localRelativeUrl = `/uploads/${subfolder}/${filename}`;
  return {
    url: localRelativeUrl,
    key,
    provider: 'local',
    publicUrl: localRelativeUrl
  };
}

/**
 * Get public or signed URL for accessing media assets
 */
export function getMediaUrl(urlOrKey: string, expiresInSeconds: number = 3600): string {
  if (!urlOrKey) return '';
  if (urlOrKey.startsWith('http://') || urlOrKey.startsWith('https://')) {
    return urlOrKey;
  }
  if (urlOrKey.startsWith('/uploads/')) {
    return urlOrKey;
  }
  return `/uploads/${urlOrKey.replace(/^\//, '')}`;
}

/**
 * AWS Signature Version 4 Helper for raw S3 / Cloudflare R2 uploads without external heavy SDK
 */
function createSigV4Headers({
  method,
  url,
  headers,
  payload,
  accessKeyId,
  secretAccessKey,
  region,
  service
}: {
  method: string;
  url: string;
  headers: Record<string, string>;
  payload: Buffer;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  service: string;
}): Record<string, string> {
  const targetUrl = new URL(url);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '');
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');

  const reqHeaders: Record<string, string> = {
    ...headers,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': payloadHash,
  };

  const sortedHeaderKeys = Object.keys(reqHeaders).map(k => k.toLowerCase()).sort();
  const canonicalHeaders = sortedHeaderKeys.map(k => `${k}:${reqHeaders[k]}\n`).join('');
  const signedHeaders = sortedHeaderKeys.join(';');

  const canonicalRequest = [
    method,
    targetUrl.pathname,
    targetUrl.search.replace(/^\?/, ''),
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');

  const kDate = hmac('AWS4' + secretAccessKey, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, 'aws4_request');
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    ...reqHeaders,
    'Authorization': authorizationHeader
  };
}

function hmac(key: string | Buffer, data: string): Buffer {
  return crypto.createHmac('sha256', key).update(data).digest();
}
