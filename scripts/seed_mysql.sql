USE `lovetalkpodcast`;

-- Clear existing data (in correct dependency order)
DELETE FROM `comments`;
DELETE FROM `payments`;
DELETE FROM `memberships`;
DELETE FROM `profiles`;
DELETE FROM `episodes`;
DELETE FROM `premium_benefits`;
DELETE FROM `membership_plans`;
DELETE FROM `subscribers`;
DELETE FROM `site_settings`;

-- 1. Seed Initial Profiles / Users
INSERT INTO `profiles` (`id`, `auth_user_id`, `email`, `name`, `avatar_url`, `role`, `status`, `created_at`, `last_login`) VALUES
('usr-superadmin', 'google-superadmin-1', 'superadmin@lovetalkpodcast.in', 'Super Admin Tim', '/images/tim_chels.jpg', 'super_admin', 'active', '2026-01-01 00:00:00', NOW()),
('usr-admin-1', 'google-admin-1', 'admin@lovetalkpodcast.in', 'Admin Chels', '/images/tim_chels.jpg', 'admin', 'active', '2026-02-01 00:00:00', NOW()),
('usr-premium-1', 'google-user-1', 'priya.k@gmail.com', 'Priya Kapoor', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'user', 'active', '2026-06-15 00:00:00', NOW());

-- 2. Seed Membership Plans
INSERT INTO `membership_plans` (`id`, `name`, `slug`, `target_audience`, `price`, `currency`, `billing_period`, `discounted_price`, `is_active`, `is_featured`, `badge`, `benefits`, `razorpay_plan_id`) VALUES
('plan-youth', 'Youth', 'youth', '18–26 years', 99.00, 'INR', 'year', 99.00, TRUE, TRUE, 'Best Value', JSON_ARRAY('All 25 Premium Benefits', 'Exclusive Community Access', 'Monthly Live Q&A Webinars'), 'plan_youth_annual'),
('plan-professional', 'Professional', 'professional', 'Working Professionals & 26+', 399.00, 'INR', 'year', 399.00, TRUE, FALSE, 'Popular', JSON_ARRAY('All 25 Premium Benefits', 'Exclusive Community + Channel', 'Monthly Live Q&A + Group Coaching', '10% Discount on Consultations'), 'plan_professional_annual');

-- 3. Seed Initial Active Membership
INSERT INTO `memberships` (`id`, `user_id`, `plan_id`, `status`, `razorpay_customer_id`, `razorpay_subscription_id`, `start_date`, `end_date`, `auto_renew`) VALUES
('mem-1', 'usr-premium-1', 'plan-youth', 'active', 'cust_12345', 'sub_67890', '2026-06-15 00:00:00', '2027-06-15 00:00:00', TRUE);

-- 4. Seed 25 Dynamic Premium Benefits
INSERT INTO `premium_benefits` (`id`, `title`, `description`, `icon`, `is_enabled`, `sort_order`, `plans`) VALUES
('benefit-1', 'Unlimited Unlocked Premium Episodes', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 1, JSON_ARRAY('youth', 'professional')),
('benefit-2', 'Ad-Free Listening Experience', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 2, JSON_ARRAY('youth', 'professional')),
('benefit-3', 'High Quality 320kbps Audio Streams', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 3, JSON_ARRAY('youth', 'professional')),
('benefit-4', 'Full Dual English & Hindi Transcripts', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 4, JSON_ARRAY('youth', 'professional')),
('benefit-5', 'Download Episodes for Offline Playback', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 5, JSON_ARRAY('youth', 'professional')),
('benefit-6', 'Exclusive Monthly Live Q&A Webinars', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 6, JSON_ARRAY('youth', 'professional')),
('benefit-7', 'VIP Telegram Community Channel', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 7, JSON_ARRAY('youth', 'professional')),
('benefit-8', 'Early Access to New Friday Episodes', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 8, JSON_ARRAY('youth', 'professional')),
('benefit-9', '10% Discount on 1-on-1 Relationship Consultations', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 9, JSON_ARRAY('youth', 'professional')),
('benefit-10', 'Access to "Love Talk 1.0" eBook Edition', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 10, JSON_ARRAY('youth', 'professional')),
('benefit-11', 'Private Listener Discussion Forums', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 11, JSON_ARRAY('youth', 'professional')),
('benefit-12', 'Direct Question Submission for Tim & Chels', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 12, JSON_ARRAY('youth', 'professional')),
('benefit-13', 'Exclusive Bonus After-Show Audio Clips', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 13, JSON_ARRAY('youth', 'professional')),
('benefit-14', 'Monthly Relationship Worksheets & Guides', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 14, JSON_ARRAY('youth', 'professional')),
('benefit-15', 'Group Coaching Circles', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 15, JSON_ARRAY('youth', 'professional')),
('benefit-16', 'Anxiety & Overthinking Self-Guided Journal', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 16, JSON_ARRAY('youth', 'professional')),
('benefit-17', 'Couples Communication Challenge Tracker', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 17, JSON_ARRAY('youth', 'professional')),
('benefit-18', 'Priority Customer Support', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 18, JSON_ARRAY('youth', 'professional')),
('benefit-19', 'Exclusive Member Spotlight Invites', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 19, JSON_ARRAY('youth', 'professional')),
('benefit-20', 'Custom Playlist Creator', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 20, JSON_ARRAY('youth', 'professional')),
('benefit-21', 'Sponsor Discount Perks', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 21, JSON_ARRAY('youth', 'professional')),
('benefit-22', 'Annual Relationship Wellness Report', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 22, JSON_ARRAY('youth', 'professional')),
('benefit-23', 'Invites to Regional Meetups in India', 'Included with all Love Talk Premium Subscriptions.', 'Sparkles', TRUE, 23, JSON_ARRAY('youth', 'professional')),
('benefit-24', 'Self-Connection Meditation Audios', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 24, JSON_ARRAY('youth', 'professional')),
('benefit-25', 'Lifetime Access to Episode Archives', 'Included with all Love Talk Premium Subscriptions.', 'CheckCircle2', TRUE, 25, JSON_ARRAY('youth', 'professional'));

-- 5. Seed Episodes
INSERT INTO `episodes` (`id`, `title`, `episode_number`, `slug`, `description`, `audio_url`, `audio_duration`, `cover_image`, `language`, `tags`, `publish_date`, `is_published`, `access_type`, `preview_duration`, `transcript_en`, `transcript_hi`, `listens_count`) VALUES
('ep-14', 'Why Self Connection is the Foundation of Love', 14, 'why-self-connection-is-the-foundation', 'In this episode, Tim & Chels dive deep into why understanding your own emotional needs, boundaries, and inner child is the prerequisite for building a healthy, lasting relationship.', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 1840, '/images/episode_1.jpg', 'english', JSON_ARRAY('Self-Love', 'Emotional Wellness', 'Relationships'), '2026-08-07 09:00:00', TRUE, 'PREMIUM', 60, '[00:00] Tim: Welcome back to Love Talk Podcast! I\'m Tim.\n[00:05] Chels: And I\'m Chels! Happy Friday everyone.\n[00:10] Tim: Today we are talking about something that hits close to home for so many of us - why you cannot truly love someone else until you build a deep connection with yourself.', '[00:00] टिम: लव टॉक्स पॉडकास्ट में आपका स्वागत है! मैं टिम हूँ।\n[00:05] चेल्स: और मैं चेल्स! आप सभी को शुभ शुक्रवार।', 14200),

('ep-13', 'रिश्तों में कम्यूनिकेशन और ओवरथिंकिंग (Communication & Overthinking)', 13, 'communication-and-overthinking-in-relationships', 'कैसे ओवरथिंकिंग आपके रिश्ते को प्रभावित करती है और टिम-चेल्स के साथ समझें सही कम्यूनिकेशन का तरीका। Special bilingual episode addressing mixed signals and emotional safety.', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 2100, '/images/podcast_cover.jpg', 'hindi', JSON_ARRAY('Communication', 'Hindi Special', 'Emotional Wellness'), '2026-07-31 09:00:00', TRUE, 'FREE', 0, '[00:00] Tim: Namaste and welcome to episode 13! Today we are discussing overthinking in modern relationships.', '[00:00] टिम: नमस्ते और एपिसोड 13 में आपका स्वागत है! आज हम मॉडर्न रिलेशनशिप्स में ओवरथिंकिंग पर चर्चा कर रहे हैं।', 22800),

('ep-12', 'Expectations vs Reality in Modern Dating', 12, 'expectations-vs-reality-in-dating', 'Are social media aesthetics ruining your dating expectations? Tim & Chels discuss realistic romantic benchmarks, conflict resolution, and finding genuine partnership.', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 1650, '/images/tim_chels.jpg', 'bilingual', JSON_ARRAY('Dating & Relationships', 'Communication'), '2026-07-24 09:00:00', TRUE, 'FREE', 0, NULL, NULL, 18900),

('ep-11', 'Dealing with Past Baggage & Healing Together', 11, 'dealing-with-past-baggage', 'How to bring your past heartbreaks into a new relationship without allowing previous hurts to sabotage present happiness.', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 1980, '/images/podcast_cover.jpg', 'english', JSON_ARRAY('Emotional Wellness', 'Self-Love'), '2026-07-17 09:00:00', TRUE, 'FREE', 0, NULL, NULL, 15600),

('ep-10', 'शादी और भविष्य के फैसले (Marriage & Financial Compatibility)', 10, 'marriage-and-financial-compatibility', 'फाइनेंस और मैरिज कमिटमेंट पर खुल कर बात कैसे करें? Tim & Chels outline essential pre-marriage conversation frameworks for Indian couples.', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 2400, '/images/episode_1.jpg', 'hindi', JSON_ARRAY('Marriage & Future', 'Hindi Special', 'Communication'), '2026-07-10 09:00:00', TRUE, 'FREE', 0, NULL, NULL, 31200);

-- 6. Seed Comments
INSERT INTO `comments` (`id`, `episode_id`, `user_name`, `user_email`, `user_avatar`, `rating`, `content`, `likes_count`, `created_at`) VALUES
('c-1', 'ep-14', 'Ananya Sharma', 'ananya@example.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 5, 'This episode came at the exact right moment in my life. Tim & Chels, your insights on anxious attachment helped me realize how much I was seeking external validation.', 34, '2026-08-07 14:20:00'),
('c-2', 'ep-13', 'Rohan Verma', 'rohan@example.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 5, 'Such a relatable episode! Communication over assumption is truly key.', 19, '2026-08-01 10:15:00');

-- 7. Seed Subscribers
INSERT INTO `subscribers` (`id`, `email`, `name`, `subscribed_at`) VALUES
('sub-1', 'listener1@example.com', 'Priya Kapoor', '2026-08-01 12:00:00');

-- 8. Seed Site Settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`) VALUES
('general', JSON_OBJECT(
  'siteName', 'Love Talk Podcast',
  'logoUrl', '/images/podcast_cover.jpg',
  'contactEmail', 'support@lovetalkpodcast.in',
  'podcastName', 'Love Talk Podcast with Tim & Chels',
  'hostNames', 'Tim & Chels',
  'defaultLanguage', 'english',
  'enablePremium', true,
  'enableYouthPlan', true,
  'enableProfessionalPlan', true,
  'razorpayConnected', true,
  'webhookConfigured', true
));
