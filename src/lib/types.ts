export type Language = 'english' | 'hindi' | 'bilingual';

export type EpisodeAccessType = 'FREE' | 'PREMIUM';

export type UserRole = 'user' | 'admin' | 'super_admin';

export type UserStatus = 'active' | 'suspended';

export type MembershipStatus = 'active' | 'pending' | 'expired' | 'cancelled' | 'failed' | 'paused';

export interface UserProfile {
  id: string;
  auth_user_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  target_audience: string;
  price: number;
  currency: string;
  billing_period: 'year' | 'month';
  discounted_price?: number;
  is_active: boolean;
  is_featured: boolean;
  badge?: string; // e.g. 'Best Value', 'Popular'
  benefits: string[];
  razorpay_plan_id?: string;
  created_at?: string;
}

export interface UserMembership {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name?: string;
  status: MembershipStatus;
  razorpay_customer_id?: string;
  razorpay_subscription_id?: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  membership_id?: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_subscription_id?: string;
  amount: number;
  currency: string;
  status: 'captured' | 'failed' | 'refunded' | 'pending';
  payment_method: string;
  paid_at: string;
}

export interface PremiumBenefit {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  is_enabled: boolean;
  sort_order: number;
  plans: string[]; // ['youth', 'professional']
}

export interface Comment {
  id: string;
  episode_id: string;
  user_name: string;
  user_email: string;
  user_avatar?: string;
  rating: number; // 1-5
  content: string;
  likes_count: number;
  created_at: string;
}

export interface Episode {
  id: string;
  title: string;
  episode_number: number;
  slug: string;
  description: string;
  audio_url: string;
  audio_duration: number; // seconds
  cover_image: string;
  language: Language;
  tags: string[];
  publish_date: string;
  is_published: boolean;
  access_type: EpisodeAccessType;
  preview_duration?: number; // seconds (default 60)
  transcript_en?: string;
  transcript_hi?: string;
  listens_count: number;
  comments?: Comment[];
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribed_at: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  contactEmail: string;
  podcastName: string;
  hostNames: string;
  defaultLanguage: string;
  enablePremium: boolean;
  enableYouthPlan: boolean;
  enableProfessionalPlan: boolean;
  razorpayKeyId?: string;
  razorpayConnected: boolean;
  webhookConfigured: boolean;
}

export type CategoryTag = 
  | 'All'
  | 'Self-Love'
  | 'Dating & Relationships'
  | 'Communication'
  | 'Emotional Wellness'
  | 'Marriage & Future'
  | 'Hindi Special';
