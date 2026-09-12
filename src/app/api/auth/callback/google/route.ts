import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { UserRole } from '@/lib/types';

export const dynamic = 'force-dynamic';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const APP_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const INITIAL_SUPER_ADMIN_EMAIL = (process.env.INITIAL_SUPER_ADMIN_EMAIL || 'superadmin@lovetalkpodcast.in').toLowerCase().trim();

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const directIdToken = searchParams.get('id_token');

  if (error) {
    console.error('Google OAuth redirect error:', error);
    return NextResponse.redirect(`${APP_URL}/login?error=${encodeURIComponent(error)}`);
  }

  let email = '';
  let name = '';
  let avatarUrl = '';
  let googleId = '';

  try {
    if (code) {
      // Exchange authorization code for tokens with Google
      const redirectUri = `${APP_URL}/api/auth/callback/google`;
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || tokenData.error) {
        console.error('Google OAuth token exchange failed:', tokenData);
        return NextResponse.redirect(`${APP_URL}/login?error=${encodeURIComponent(tokenData.error_description || 'OAuth token exchange failed')}`);
      }

      if (tokenData.id_token) {
        const payload = parseJwt(tokenData.id_token);
        if (payload) {
          email = payload.email;
          name = payload.name;
          avatarUrl = payload.picture;
          googleId = payload.sub;
        }
      }

      if (!email && tokenData.access_token) {
        const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        if (userinfoRes.ok) {
          const userinfo = await userinfoRes.json();
          email = userinfo.email;
          name = userinfo.name;
          avatarUrl = userinfo.picture;
          googleId = userinfo.sub;
        }
      }
    } else if (directIdToken) {
      const payload = parseJwt(directIdToken);
      if (payload) {
        email = payload.email;
        name = payload.name;
        avatarUrl = payload.picture;
        googleId = payload.sub;
      }
    }

    if (!email) {
      return NextResponse.redirect(`${APP_URL}/login?error=${encodeURIComponent('No email received from Google authentication')}`);
    }

    const cleanEmail = email.toLowerCase().trim();
    const authUserId = googleId ? `google_${googleId}` : `google_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
    const displayName = name || cleanEmail.split('@')[0];
    const avatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Check if user profile exists in MySQL profiles table
    const existingProfiles = await query<any[]>(
      `SELECT * FROM profiles WHERE email = ? OR auth_user_id = ? LIMIT 1`,
      [cleanEmail, authUserId]
    );

    let role: UserRole = cleanEmail === INITIAL_SUPER_ADMIN_EMAIL ? 'super_admin' : 'user';
    let userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (existingProfiles.length > 0) {
      const existing = existingProfiles[0];
      userId = existing.id;
      role = existing.role as UserRole;

      await query(
        `UPDATE profiles SET 
          name = COALESCE(?, name), 
          avatar_url = COALESCE(?, avatar_url), 
          last_login = ?, 
          updated_at = ? 
         WHERE id = ?`,
        [displayName, avatar, now, now, userId]
      );
    } else {
      await query(
        `INSERT INTO profiles (id, auth_user_id, email, name, avatar_url, role, status, created_at, updated_at, last_login)
         VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
          name = VALUES(name), 
          avatar_url = VALUES(avatar_url), 
          last_login = VALUES(last_login)`,
        [userId, authUserId, cleanEmail, displayName, avatar, role, now, now, now]
      );
    }

    // Set auth session data in cookies and redirect to destination
    const targetUrl = (role === 'super_admin' || role === 'admin') ? `${APP_URL}/super-admin` : `${APP_URL}/account`;
    const response = NextResponse.redirect(targetUrl);

    const authUserData = {
      id: userId,
      auth_user_id: authUserId,
      email: cleanEmail,
      name: displayName,
      avatar_url: avatar,
      role,
      status: 'active'
    };

    response.cookies.set('lovetalk_user_session', JSON.stringify(authUserData), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return response;
  } catch (err: any) {
    console.error('Error handling Google OAuth callback:', err);
    return NextResponse.redirect(`${APP_URL}/login?error=${encodeURIComponent(err.message || 'OAuth callback failed')}`);
  }
}
