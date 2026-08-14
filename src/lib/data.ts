import { Episode, Comment, Subscriber, MembershipPlan, PremiumBenefit, UserProfile, UserMembership, PaymentRecord, SiteSettings } from './types';

// 1. Initial Membership Plans
export const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 'plan-youth',
    name: 'Youth',
    slug: 'youth',
    target_audience: '18–26 years',
    price: 99,
    currency: 'INR',
    billing_period: 'year',
    discounted_price: 99,
    is_active: true,
    is_featured: true,
    badge: 'Best Value',
    benefits: [
      'All 25 Premium Benefits',
      'Exclusive Community Access',
      'Monthly Live Q&A Webinars'
    ],
    razorpay_plan_id: 'plan_youth_annual'
  },
  {
    id: 'plan-professional',
    name: 'Professional',
    slug: 'professional',
    target_audience: 'Working Professionals & 26+',
    price: 399,
    currency: 'INR',
    billing_period: 'year',
    discounted_price: 399,
    is_active: true,
    is_featured: false,
    badge: 'Popular',
    benefits: [
      'All 25 Premium Benefits',
      'Exclusive Community + Channel',
      'Monthly Live Q&A + Group Coaching',
      '10% Discount on Consultations'
    ],
    razorpay_plan_id: 'plan_professional_annual'
  }
];

// 2. Initial 25 Dynamic Premium Benefits
export const INITIAL_BENEFITS: PremiumBenefit[] = Array.from({ length: 25 }, (_, i) => {
  const titles = [
    'Unlimited Unlocked Premium Episodes',
    'Ad-Free Listening Experience',
    'High Quality 320kbps Audio Streams',
    'Full Dual English & Hindi Transcripts',
    'Download Episodes for Offline Playback',
    'Exclusive Monthly Live Q&A Webinars',
    'VIP Telegram Community Channel',
    'Early Access to New Friday Episodes',
    '10% Discount on 1-on-1 Relationship Consultations',
    'Access to "Love Talk 1.0" eBook Edition',
    'Private Listener Discussion Forums',
    'Direct Question Submission for Tim & Chels',
    'Exclusive Bonus After-Show Audio Clips',
    'Monthly Relationship Worksheets & Guides',
    'Group Coaching Circles',
    'Anxiety & Overthinking Self-Guided Journal',
    'Couples Communication Challenge Tracker',
    'Priority Customer Support',
    'Exclusive Member Spotlight Invites',
    'Custom Playlist Creator',
    'Sponsor Discount Perks',
    'Annual Relationship Wellness Report',
    'Invites to Regional Meetups in India',
    'Self-Connection Meditation Audios',
    'Lifetime Access to Episode Archives'
  ];
  return {
    id: `benefit-${i + 1}`,
    title: titles[i],
    description: `Included with all Love Talk Premium Subscriptions.`,
    icon: i % 2 === 0 ? 'Sparkles' : 'CheckCircle2',
    is_enabled: true,
    sort_order: i + 1,
    plans: ['youth', 'professional']
  };
});

// 3. Initial Episodes with Access Types (FREE vs PREMIUM)
export const INITIAL_EPISODES: Episode[] = [
  {
    id: 'ep-14',
    title: 'Why Self Connection is the Foundation of Love',
    episode_number: 14,
    slug: 'why-self-connection-is-the-foundation',
    description: 'In this episode, Tim & Chels dive deep into why understanding your own emotional needs, boundaries, and inner child is the prerequisite for building a healthy, lasting relationship.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    audio_duration: 1840, // 30m 40s
    cover_image: '/images/episode_1.jpg',
    language: 'english',
    tags: ['Self-Love', 'Emotional Wellness', 'Relationships'],
    publish_date: '2026-08-07T09:00:00Z',
    is_published: true,
    access_type: 'PREMIUM', // Protected Premium Audio
    preview_duration: 60, // 60 seconds preview for free users
    listens_count: 14200,
    transcript_en: `[00:00] Tim: Welcome back to Love Talk Podcast! I'm Tim.
[00:05] Chels: And I'm Chels! Happy Friday everyone.
[00:10] Tim: Today we are talking about something that hits close to home for so many of us - why you cannot truly love someone else until you build a deep connection with yourself.
[00:45] Chels: Absolutely Tim. Overthinking, anxious attachment, and constant reassurance seeking often stem from losing touch with our own self-worth.
[02:15] Tim: We share 3 actionable steps to practice self-compassion, ground your emotions, and show up authentically in your dating life.`,
    transcript_hi: `[00:00] टिम: लव टॉक्स पॉडकास्ट में आपका स्वागत है! मैं टिम हूँ।
[00:05] चेल्स: और मैं चेल्स! आप सभी को शुभ शुक्रवार।
[00:10] टिम: आज हम एक ऐसे विषय पर बात कर रहे हैं जो हम सभी के दिल के बहुत करीब है - जब तक आप खुद से गहरा जुड़ाव नहीं बनाते, तब तक आप किसी और से सच्चा प्यार कैसे कर सकते हैं?
[00:45] चेल्स: बिल्कुल टिम। अत्यधिक सोचना (overthinking) और लगातार आश्वासन मांगना अक्सर खुद से जुड़ाव खोने के कारण होता है।`,
    comments: [
      {
        id: 'c-1',
        episode_id: 'ep-14',
        user_name: 'Ananya Sharma',
        user_email: 'ananya@example.com',
        user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        rating: 5,
        content: 'This episode came at the exact right moment in my life. Tim & Chels, your insights on anxious attachment helped me realize how much I was seeking external validation.',
        likes_count: 34,
        created_at: '2026-08-07T14:20:00Z'
      }
    ]
  },
  {
    id: 'ep-13',
    title: 'रिश्तों में कम्यूनिकेशन और ओवरथिंकिंग (Communication & Overthinking)',
    episode_number: 13,
    slug: 'communication-and-overthinking-in-relationships',
    description: 'कैसे ओवरथिंकिंग आपके रिश्ते को प्रभावित करती है और टिम-चेल्स के साथ समझें सही कम्यूनिकेशन का तरीका। Special bilingual episode addressing mixed signals and emotional safety.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    audio_duration: 2100, // 35m
    cover_image: '/images/podcast_cover.jpg',
    language: 'hindi',
    tags: ['Communication', 'Hindi Special', 'Emotional Wellness'],
    publish_date: '2026-07-31T09:00:00Z',
    is_published: true,
    access_type: 'FREE',
    preview_duration: 0,
    listens_count: 22800,
    transcript_en: `[00:00] Tim: Namaste and welcome to episode 13! Today we are discussing overthinking in modern relationships.`,
    transcript_hi: `[00:00] टिम: नमस्ते और एपिसोड 13 में आपका स्वागत है! आज हम मॉडर्न रिलेशनशिप्स में ओवरथिंकिंग पर चर्चा कर रहे हैं।`,
    comments: []
  },
  {
    id: 'ep-12',
    title: 'Expectations vs Reality in Modern Dating',
    episode_number: 12,
    slug: 'expectations-vs-reality-in-dating',
    description: 'Are social media aesthetics ruining your dating expectations? Tim & Chels discuss realistic romantic benchmarks, conflict resolution, and finding genuine partnership.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    audio_duration: 1650, // 27m 30s
    cover_image: '/images/tim_chels.jpg',
    language: 'bilingual',
    tags: ['Dating & Relationships', 'Communication'],
    publish_date: '2026-07-24T09:00:00Z',
    is_published: true,
    access_type: 'FREE',
    preview_duration: 0,
    listens_count: 18900,
    comments: []
  },
  {
    id: 'ep-11',
    title: 'Dealing with Past Baggage & Healing Together',
    episode_number: 11,
    slug: 'dealing-with-past-baggage',
    description: 'How to bring your past heartbreaks into a new relationship without allowing previous hurts to sabotage present happiness.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    audio_duration: 1980, // 33m
    cover_image: '/images/podcast_cover.jpg',
    language: 'english',
    tags: ['Emotional Wellness', 'Self-Love'],
    publish_date: '2026-07-17T09:00:00Z',
    is_published: true,
    access_type: 'FREE',
    preview_duration: 0,
    listens_count: 15600,
    comments: []
  },
  {
    id: 'ep-10',
    title: 'शादी और भविष्य के फैसले (Marriage & Financial Compatibility)',
    episode_number: 10,
    slug: 'marriage-and-financial-compatibility',
    description: 'फाइनेंस और मैरिज कमिटमेंट पर खुल कर बात कैसे करें? Tim & Chels outline essential pre-marriage conversation frameworks for Indian couples.',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    audio_duration: 2400, // 40m
    cover_image: '/images/episode_1.jpg',
    language: 'hindi',
    tags: ['Marriage & Future', 'Hindi Special', 'Communication'],
    publish_date: '2026-07-10T09:00:00Z',
    is_published: true,
    access_type: 'FREE',
    preview_duration: 0,
    listens_count: 31200,
    comments: []
  }
];

// 4. Initial Users for RBAC
export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'usr-superadmin',
    auth_user_id: 'google-superadmin-id',
    email: 'superadmin@lovetalkpodcast.in',
    name: 'Super Admin Tim',
    avatar_url: '/images/tim_chels.jpg',
    role: 'super_admin',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    last_login: new Date().toISOString()
  },
  {
    id: 'usr-admin-1',
    auth_user_id: 'google-admin-id',
    email: 'admin@lovetalkpodcast.in',
    name: 'Admin Chels',
    avatar_url: '/images/tim_chels.jpg',
    role: 'admin',
    status: 'active',
    created_at: '2026-02-01T00:00:00Z',
    last_login: new Date().toISOString()
  },
  {
    id: 'usr-premium-1',
    auth_user_id: 'google-user-1',
    email: 'priya.k@gmail.com',
    name: 'Priya Kapoor',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'user',
    status: 'active',
    created_at: '2026-06-15T00:00:00Z',
    last_login: new Date().toISOString()
  }
];

// 5. Initial Memberships
export const INITIAL_MEMBERSHIPS: UserMembership[] = [
  {
    id: 'mem-1',
    user_id: 'usr-premium-1',
    plan_id: 'plan-youth',
    plan_name: 'Youth Plan (₹99/year)',
    status: 'active',
    razorpay_customer_id: 'cust_12345',
    razorpay_subscription_id: 'sub_67890',
    start_date: '2026-06-15T00:00:00Z',
    end_date: '2027-06-15T00:00:00Z',
    auto_renew: true,
    created_at: '2026-06-15T00:00:00Z'
  }
];

// 6. Initial Payment Records
export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    user_id: 'usr-premium-1',
    membership_id: 'mem-1',
    razorpay_payment_id: 'pay_LMN987654321',
    razorpay_order_id: 'order_ABC123456789',
    amount: 99,
    currency: 'INR',
    status: 'captured',
    payment_method: 'UPI',
    paid_at: '2026-06-15T00:05:00Z'
  }
];

// 7. Initial Site Settings
export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'Love Talk Podcast',
  logoUrl: '/images/podcast_cover.jpg',
  contactEmail: 'support@lovetalkpodcast.in',
  podcastName: 'Love Talk Podcast with Tim & Chels',
  hostNames: 'Tim & Chels',
  defaultLanguage: 'English & Hindi',
  enablePremium: true,
  enableYouthPlan: true,
  enableProfessionalPlan: true,
  razorpayKeyId: 'rzp_test_lovetalk2026',
  razorpayConnected: true,
  webhookConfigured: true
};

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: 'sub-1', email: 'fan1@lovetalk.in', name: 'Aarav Mehta', subscribed_at: '2026-08-01T12:00:00Z' },
  { id: 'sub-2', email: 'meera@lovetalk.in', name: 'Meera Kapoor', subscribed_at: '2026-08-03T15:30:00Z' }
];

// Local Storage Helper Functions
const STORAGE_KEY_EPISODES = 'lovetalk_episodes_v2';
const STORAGE_KEY_PLANS = 'lovetalk_plans_v2';
const STORAGE_KEY_BENEFITS = 'lovetalk_benefits_v2';
const STORAGE_KEY_PROFILES = 'lovetalk_profiles_v2';
const STORAGE_KEY_MEMBERSHIPS = 'lovetalk_memberships_v2';
const STORAGE_KEY_PAYMENTS = 'lovetalk_payments_v2';
const STORAGE_KEY_SETTINGS = 'lovetalk_settings_v2';

export function getStoredEpisodes(): Episode[] {
  if (typeof window === 'undefined') return INITIAL_EPISODES;
  const stored = localStorage.getItem(STORAGE_KEY_EPISODES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_EPISODES, JSON.stringify(INITIAL_EPISODES));
    return INITIAL_EPISODES;
  }
  try { return JSON.parse(stored); } catch { return INITIAL_EPISODES; }
}

export function saveStoredEpisodes(episodes: Episode[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_EPISODES, JSON.stringify(episodes));
  }
}

export function getStoredPlans(): MembershipPlan[] {
  if (typeof window === 'undefined') return INITIAL_PLANS;
  const stored = localStorage.getItem(STORAGE_KEY_PLANS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(INITIAL_PLANS));
    return INITIAL_PLANS;
  }
  try { return JSON.parse(stored); } catch { return INITIAL_PLANS; }
}

export function saveStoredPlans(plans: MembershipPlan[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
  }
}

export function getStoredBenefits(): PremiumBenefit[] {
  if (typeof window === 'undefined') return INITIAL_BENEFITS;
  const stored = localStorage.getItem(STORAGE_KEY_BENEFITS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_BENEFITS, JSON.stringify(INITIAL_BENEFITS));
    return INITIAL_BENEFITS;
  }
  try { return JSON.parse(stored); } catch { return INITIAL_BENEFITS; }
}

export function saveStoredBenefits(benefits: PremiumBenefit[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_BENEFITS, JSON.stringify(benefits));
  }
}

export function getStoredProfiles(): UserProfile[] {
  if (typeof window === 'undefined') return INITIAL_PROFILES;
  const stored = localStorage.getItem(STORAGE_KEY_PROFILES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(INITIAL_PROFILES));
    return INITIAL_PROFILES;
  }
  try { return JSON.parse(stored); } catch { return INITIAL_PROFILES; }
}

export function saveStoredProfiles(profiles: UserProfile[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  }
}

export function getStoredMemberships(): UserMembership[] {
  if (typeof window === 'undefined') return INITIAL_MEMBERSHIPS;
  const stored = localStorage.getItem(STORAGE_KEY_MEMBERSHIPS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_MEMBERSHIPS, JSON.stringify(INITIAL_MEMBERSHIPS));
    return INITIAL_MEMBERSHIPS;
  }
  try { return JSON.parse(stored); } catch { return INITIAL_MEMBERSHIPS; }
}

export function saveStoredMemberships(mems: UserMembership[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_MEMBERSHIPS, JSON.stringify(mems));
  }
}

export function getStoredPayments(): PaymentRecord[] {
  if (typeof window === 'undefined') return INITIAL_PAYMENTS;
  const stored = localStorage.getItem(STORAGE_KEY_PAYMENTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    return INITIAL_PAYMENTS;
  }
  try { return JSON.parse(stored); } catch { return INITIAL_PAYMENTS; }
}

export function saveStoredPayments(payments: PaymentRecord[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
  }
}

export function getStoredSettings(): SiteSettings {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }
  try { return JSON.parse(stored); } catch { return INITIAL_SETTINGS; }
}

export function saveStoredSettings(settings: SiteSettings): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }
}

export function addSubscriber(email: string, name?: string): Subscriber {
  const current = getStoredSubscribers();
  const existing = current.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;

  const newSub: Subscriber = {
    id: `sub-${Date.now()}`,
    email,
    name,
    subscribed_at: new Date().toISOString()
  };
  const updated = [newSub, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem('lovetalk_subscribers_v1', JSON.stringify(updated));
  }
  return newSub;
}

export function getStoredSubscribers(): Subscriber[] {
  if (typeof window === 'undefined') return INITIAL_SUBSCRIBERS;
  const stored = localStorage.getItem('lovetalk_subscribers_v1');
  if (!stored) {
    localStorage.setItem('lovetalk_subscribers_v1', JSON.stringify(INITIAL_SUBSCRIBERS));
    return INITIAL_SUBSCRIBERS;
  }
  try { return JSON.parse(stored); } catch { return INITIAL_SUBSCRIBERS; }
}
