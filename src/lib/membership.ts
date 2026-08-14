import { getStoredMemberships, getStoredProfiles, saveStoredMemberships } from './data';
import { UserMembership, UserProfile } from './types';

/**
 * Reusable server-side helper to check if a user has active premium access.
 */
export function hasPremiumAccess(userId?: string | null): boolean {
  if (!userId) return false;

  // 1. Check if user is Admin or Super Admin
  const profiles = getStoredProfiles();
  const user = profiles.find(p => p.id === userId || p.auth_user_id === userId || p.email === userId);
  if (user && (user.role === 'super_admin' || user.role === 'admin')) {
    return true;
  }

  if (!user) return false;

  // 2. Check active membership
  const memberships = getStoredMemberships();
  const userMem = memberships.find(m => m.user_id === user.id && m.status === 'active');
  if (!userMem) return false;

  const now = new Date();
  const expiry = new Date(userMem.end_date);

  // If expired, update status to expired
  if (now > expiry) {
    const updated = memberships.map(m => m.id === userMem.id ? { ...m, status: 'expired' as const } : m);
    saveStoredMemberships(updated);
    return false;
  }

  return true;
}

export function getUserActiveMembership(userId: string): UserMembership | null {
  const profiles = getStoredProfiles();
  const user = profiles.find(p => p.id === userId || p.auth_user_id === userId || p.email === userId);
  if (!user) return null;

  const memberships = getStoredMemberships();
  return memberships.find(m => m.user_id === user.id && m.status === 'active') || null;
}
