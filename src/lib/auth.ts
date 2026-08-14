import { UserProfile, UserRole } from './types';
import { getStoredProfiles, saveStoredProfiles } from './data';

const INITIAL_SUPER_ADMIN_EMAIL = process.env.INITIAL_SUPER_ADMIN_EMAIL || 'superadmin@lovetalkpodcast.in';

export function isSuperAdminEmail(email: string): boolean {
  return email.toLowerCase() === INITIAL_SUPER_ADMIN_EMAIL.toLowerCase();
}

export function getUserProfileByEmail(email: string): UserProfile | null {
  const profiles = getStoredProfiles();
  return profiles.find(p => p.email.toLowerCase() === email.toLowerCase()) || null;
}

export function createOrUpdateGoogleUser(googleUser: {
  email: string;
  name: string;
  avatar_url?: string;
  sub?: string;
}): UserProfile {
  const profiles = getStoredProfiles();
  const existing = profiles.find(p => p.email.toLowerCase() === googleUser.email.toLowerCase());

  if (existing) {
    const updated = profiles.map(p => p.id === existing.id ? {
      ...p,
      name: googleUser.name || p.name,
      avatar_url: googleUser.avatar_url || p.avatar_url,
      last_login: new Date().toISOString()
    } : p);
    saveStoredProfiles(updated);
    return { ...existing, last_login: new Date().toISOString() };
  }

  // Determine initial role: if matching INITIAL_SUPER_ADMIN_EMAIL, make super_admin
  const role: UserRole = isSuperAdminEmail(googleUser.email) ? 'super_admin' : 'user';

  const newProfile: UserProfile = {
    id: `usr-${Date.now()}`,
    auth_user_id: googleUser.sub || `google-${Date.now()}`,
    email: googleUser.email,
    name: googleUser.name || googleUser.email.split('@')[0],
    avatar_url: googleUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(googleUser.name || googleUser.email)}`,
    role,
    status: 'active',
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  };

  const updated = [newProfile, ...profiles];
  saveStoredProfiles(updated);
  return newProfile;
}

export function verifyRolePermission(userRole: UserRole, requiredRole: UserRole): boolean {
  if (userRole === 'super_admin') return true;
  if (userRole === 'admin' && (requiredRole === 'admin' || requiredRole === 'user')) return true;
  if (userRole === 'user' && requiredRole === 'user') return true;
  return false;
}
