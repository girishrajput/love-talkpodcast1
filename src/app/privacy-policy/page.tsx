'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Mail, 
  MapPin, 
  Globe, 
  ChevronRight,
  Database,
  Eye,
  Key,
  AlertTriangle,
  UserCheck,
  Building,
  Radio,
  Share2,
  Server,
  Scale
} from 'lucide-react';

const tocItems = [
  { id: 'section-1', title: '1. About LoveTalk Podcast' },
  { id: 'section-2', title: '2. Information We May Collect' },
  { id: 'section-3', title: '3. Automatically Collected Information' },
  { id: 'section-4', title: '4. Cookies and Similar Technologies' },
  { id: 'section-5', title: '5. How We Use Your Information' },
  { id: 'section-6', title: '6. Podcast Guest & Contributor Information' },
  { id: 'section-7', title: '7. User-Submitted Content' },
  { id: 'section-8', title: '8. Membership & Account Information' },
  { id: 'section-9', title: '9. Communications' },
  { id: 'section-10', title: '10. Third-Party Services & Platforms' },
  { id: 'section-11', title: '11. External Links' },
  { id: 'section-12', title: '12. Data Security' },
  { id: 'section-13', title: '13. Data Retention' },
  { id: 'section-14', title: '14. Your Privacy Choices & Rights' },
  { id: 'section-15', title: '15. Children\'s Privacy' },
  { id: 'section-16', title: '16. Sensitive Personal Information' },
  { id: 'section-17', title: '17. Data Sharing & Disclosure' },
  { id: 'section-18', title: '18. Business Transfers' },
  { id: 'section-19', title: '19. International Data Processing' },
  { id: 'section-20', title: '20. Marketing & Advertising' },
  { id: 'section-21', title: '21. No Guarantee of Third-Party Security' },
  { id: 'section-22', title: '22. Changes to This Privacy Policy' },
  { id: 'section-23', title: '23. Relationship With Terms & Conditions' },
  { id: 'section-24', title: '24. Contact Us' },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('section-1');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const item of tocItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Navigation & Header */}
      <div className="space-y-4 border-b border-gray-200 dark:border-gray-800 pb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5" /> Official Privacy Policy
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-1">
              LoveTalk Podcast by Kota RJ Pawan
            </p>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 px-4 py-2 rounded-xl font-mono border border-gray-200 dark:border-gray-700">
            Last Updated: <span className="font-bold text-gray-900 dark:text-white">22 August 2026</span>
          </div>
        </div>
      </div>

      {/* Main Grid: TOC Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Sticky Table of Contents (Desktop) */}
        <aside className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto space-y-3 bg-gray-50/80 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 backdrop-blur-sm custom-scrollbar">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 sticky top-0 bg-gray-50/90 dark:bg-gray-900/90 py-1 z-10 backdrop-blur-sm">
              <FileText className="w-4 h-4 text-brand-600" /> Policy Index (24 Sections)
            </h3>

            <nav className="space-y-0.5">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between ${
                    activeSection === item.id
                      ? 'bg-brand-600 text-white font-bold shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="truncate">{item.title}</span>
                  {activeSection === item.id && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Legal Document Content */}
        <main className="lg:col-span-3 space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
          
          {/* Preamble Intro */}
          <div className="bg-brand-500/5 dark:bg-brand-950/20 border border-brand-500/20 p-6 rounded-2xl text-xs sm:text-sm space-y-3">
            <p className="font-bold text-gray-900 dark:text-white">
              LoveTalk Podcast by Kota RJ Pawan (“LoveTalk Podcast”, “we”, “us”, or “our”) respects your privacy and is committed to protecting the personal information of visitors, listeners, members, guests, contributors and users of our official website (<a href="http://www.lovetalkpodcast.in" target="_blank" rel="noreferrer" className="text-brand-600 underline font-mono">http://www.lovetalkpodcast.in</a>).
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              This Privacy Policy explains what information we may collect, why we collect it, how we use and protect it, when it may be shared, and the choices available to you.
            </p>
            <p className="text-xs font-semibold text-gray-500">
              By accessing or using our Website, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>

          {/* Mobile TOC Quick Navigation */}
          <div className="lg:hidden bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Quick Navigation</h4>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:border-brand-500"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* 1. About LoveTalk Podcast */}
          <section id="section-1" className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-600" /> 1. About LoveTalk Podcast
            </h2>
            <p>
              LoveTalk Podcast is a relationship and emotional-wellness focused podcast and media platform hosted by Kota RJ Pawan. Media flagship subsidiary of <strong>Truelove18club international luxurious wellness private limited india</strong>.
            </p>
            <p>Our Website (<a href="http://www.lovetalkpodcast.in" target="_blank" rel="noreferrer" className="text-brand-600 underline">http://www.lovetalkpodcast.in</a>) may provide access to:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Podcast episodes</li>
              <li>Articles and blogs</li>
              <li>Video and audio content</li>
              <li>Educational resources</li>
              <li>Newsletters</li>
              <li>Memberships and premium services</li>
              <li>Events and community activities</li>
              <li>Contact and enquiry forms</li>
              <li>Guest and collaboration opportunities</li>
              <li>Promotional campaigns</li>
              <li>Links to external podcast and social-media platforms</li>
            </ul>
          </section>

          {/* 2. Information We May Collect */}
          <section id="section-2" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-600" /> 2. Information We May Collect
            </h2>
            <p>Depending on how you interact with our Website, we may collect certain information.</p>
            
            <div className="space-y-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">2.1 Information You Provide Directly</h3>
              <p>You may voluntarily provide information such as:</p>
              <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>City or general location</li>
                <li>Age or age range where relevant</li>
                <li>Social-media profile information</li>
                <li>Membership information</li>
                <li>Communication preferences</li>
                <li>Questions, feedback or enquiries</li>
                <li>Guest/application information</li>
                <li>Information submitted through forms</li>
                <li>Other information you voluntarily provide to us</li>
              </ul>
              <p className="text-xs italic text-gray-500">
                Please do not submit sensitive personal information unless it is specifically requested and you are comfortable providing it.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">2.2 Payment Information</h3>
              <p>
                If paid memberships, products, events or services are offered, payments may be processed through third-party payment providers (e.g., Razorpay). We generally do not directly store complete payment-card details on our Website unless specifically stated. Payment providers may independently process information according to their own privacy policies and terms.
              </p>
            </div>
          </section>

          {/* 3. Automatically Collected Information */}
          <section id="section-3" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-600" /> 3. Automatically Collected Information
            </h2>
            <p>
              When you visit our Website, certain technical information may be collected automatically, depending on the technologies and services used on the Website. This may include:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Operating system</li>
              <li>Approximate geographic information</li>
              <li>Referring website</li>
              <li>Pages visited</li>
              <li>Time spent on pages</li>
              <li>Website interaction information</li>
              <li>Date and time of access</li>
              <li>Technical and diagnostic information</li>
            </ul>
            <p className="text-xs text-gray-500">
              This information may be used for security, analytics, performance monitoring and improvement of the Website.
            </p>
          </section>

          {/* 4. Cookies and Similar Technologies */}
          <section id="section-4" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-600" /> 4. Cookies and Similar Technologies
            </h2>
            <p>LoveTalk Podcast may use cookies, pixels, tags, analytics tools and similar technologies. These technologies may help us:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Keep the Website functioning properly.</li>
              <li>Remember certain preferences.</li>
              <li>Understand Website traffic.</li>
              <li>Analyse visitor behaviour.</li>
              <li>Improve Website performance.</li>
              <li>Measure marketing campaigns.</li>
              <li>Provide relevant communications or advertising where applicable.</li>
            </ul>
            <p className="text-xs text-gray-500">
              You may be able to control cookies through your browser settings. Disabling certain cookies may affect some Website functionality.
            </p>
          </section>

          {/* 5. How We Use Your Information */}
          <section id="section-5" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-600" /> 5. How We Use Your Information
            </h2>
            <p>We may use information collected through the Website for legitimate purposes, including:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Providing Website services.</li>
              <li>Managing memberships and subscriptions.</li>
              <li>Responding to enquiries.</li>
              <li>Sending requested information.</li>
              <li>Providing newsletters or updates.</li>
              <li>Processing registrations.</li>
              <li>Managing podcast guest or collaboration requests.</li>
              <li>Improving our Website and content.</li>
              <li>Understanding audience interests and Website usage.</li>
              <li>Conducting analytics.</li>
              <li>Preventing fraud, abuse and security threats.</li>
              <li>Communicating about services, events or promotions where permitted.</li>
              <li>Complying with applicable laws and legal obligations.</li>
            </ul>
            <p className="text-xs text-gray-500">
              We do not intend to use personal information for purposes that are materially incompatible with the purpose for which it was collected without an appropriate legal basis or notice.
            </p>
          </section>

          {/* 6. Podcast Guest and Contributor Information */}
          <section id="section-6" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-brand-600" /> 6. Podcast Guest and Contributor Information
            </h2>
            <p>
              If you participate in LoveTalk Podcast as a guest, contributor, expert, creator or interviewee, information provided by you may be used for podcast production, publication, promotion and related editorial activities. This may include:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Name</li>
              <li>Professional information</li>
              <li>Photograph</li>
              <li>Voice</li>
              <li>Video</li>
              <li>Interview responses</li>
              <li>Social-media handles</li>
              <li>Biography</li>
              <li>Other information voluntarily provided for the episode</li>
            </ul>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Published podcast content may remain publicly accessible after publication. If you participate in a podcast recording, you should understand that the recording may be distributed through our Website, podcast platforms, social-media channels and other media platforms.
            </p>
          </section>

          {/* 7. User-Submitted Content */}
          <section id="section-7" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-600" /> 7. User-Submitted Content
            </h2>
            <p>
              If you voluntarily submit comments, stories, questions, testimonials, photographs, audio, video or other material, we may use that material for the purpose for which it was submitted and, where applicable, for editorial, podcast, promotional or marketing purposes in accordance with the applicable terms.
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              You should avoid submitting confidential or highly sensitive information through public comments or forms.
            </p>
          </section>

          {/* 8. Membership and Account Information */}
          <section id="section-8" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-brand-600" /> 8. Membership and Account Information
            </h2>
            <p>If LoveTalk Podcast provides membership services, we may collect information necessary to:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Create and manage your account.</li>
              <li>Verify membership status.</li>
              <li>Provide membership benefits.</li>
              <li>Process payments through applicable payment providers.</li>
              <li>Communicate important membership information.</li>
              <li>Prevent fraudulent or unauthorised use.</li>
              <li>Maintain records required for legal or business purposes.</li>
            </ul>
            <p className="text-xs text-gray-500">
              Membership information may be retained for as long as reasonably necessary for the purposes described in this Privacy Policy or as required by applicable law.
            </p>
          </section>

          {/* 9. Communications */}
          <section id="section-9" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-600" /> 9. Communications
            </h2>
            <p>If you voluntarily provide your email address or other contact information, we may use it to:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Respond to your enquiry.</li>
              <li>Provide requested information.</li>
              <li>Send service-related communications.</li>
              <li>Send newsletters where you have subscribed.</li>
              <li>Inform you about relevant LoveTalk Podcast updates, events or services where permitted.</li>
            </ul>
            <p className="text-xs text-gray-500">
              You may unsubscribe from promotional communications using the available unsubscribe mechanism or by contacting us. Please note that certain essential service-related communications may still be sent where necessary.
            </p>
          </section>

          {/* 10. Third-Party Services and Platforms */}
          <section id="section-10" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-600" /> 10. Third-Party Services and Platforms
            </h2>
            <p>
              LoveTalk Podcast may use or link to third-party services, including podcast platforms, social-media platforms, analytics providers, payment processors, email services, hosting providers and other technology providers. Examples may include platforms such as:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>YouTube</li>
              <li>Spotify</li>
              <li>Apple Podcasts</li>
              <li>Amazon Music</li>
              <li>Google services</li>
              <li>Social-media platforms</li>
              <li>Payment providers (Razorpay)</li>
              <li>Website analytics providers</li>
            </ul>
            <p className="text-xs text-gray-500">
              These third parties may independently collect and process information according to their own privacy policies. LoveTalk Podcast does not control the privacy practices of third-party platforms. We recommend reviewing the privacy policy of any third-party service before providing information or using its services.
            </p>
          </section>

          {/* 11. External Links */}
          <section id="section-11" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-600" /> 11. External Links
            </h2>
            <p>
              Our Website may contain links to websites, applications or services operated by third parties. A link to an external website does not necessarily mean that LoveTalk Podcast endorses or controls that website.
            </p>
            <p className="text-xs text-gray-500">
              Once you leave our Website, your information may be governed by the third party's privacy policy and terms. We are not responsible for the privacy, security, content or practices of third-party websites.
            </p>
          </section>

          {/* 12. Data Security */}
          <section id="section-12" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" /> 12. Data Security
            </h2>
            <p>
              We take reasonable technical and organisational measures to protect personal information against unauthorised access, misuse, loss, alteration or disclosure. However, no internet transmission or electronic storage system can be guaranteed to be completely secure.
            </p>
            <p className="text-xs font-semibold text-gray-500">
              Therefore, while we make reasonable efforts to protect information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* 13. Data Retention */}
          <section id="section-13" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-brand-600" /> 13. Data Retention
            </h2>
            <p>We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Providing services.</li>
              <li>Maintaining business records.</li>
              <li>Managing memberships.</li>
              <li>Resolving disputes.</li>
              <li>Preventing fraud.</li>
              <li>Meeting legal, tax, accounting or regulatory requirements.</li>
              <li>Protecting our legitimate interests.</li>
            </ul>
            <p className="text-xs text-gray-500">
              When information is no longer reasonably required, it may be deleted, anonymised or securely disposed of, subject to applicable legal requirements.
            </p>
          </section>

          {/* 14. Your Privacy Choices and Rights */}
          <section id="section-14" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-600" /> 14. Your Privacy Choices and Rights
            </h2>
            <p>Depending on applicable law, you may have rights concerning your personal information, which may include:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Requesting access to personal information we hold about you.</li>
              <li>Requesting correction of inaccurate information.</li>
              <li>Requesting deletion where legally applicable.</li>
              <li>Withdrawing consent where processing is based on consent.</li>
              <li>Objecting to certain processing.</li>
              <li>Requesting information about how your data is processed.</li>
              <li>Unsubscribing from promotional communications.</li>
            </ul>
            <p className="text-xs text-gray-500">
              Requests may be subject to reasonable verification requirements and applicable legal exceptions. To exercise an applicable privacy right, contact us using the official contact details provided on the Website.
            </p>
          </section>

          {/* 15. Children's Privacy */}
          <section id="section-15" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-600" /> 15. Children's Privacy
            </h2>
            <p>
              LoveTalk Podcast is not intended to knowingly collect unnecessary personal information from children. Where a service, event, membership or activity has a minimum age requirement, users must meet the applicable age requirement. Parents or legal guardians should supervise children's use of online services where appropriate.
            </p>
            <p className="text-xs text-gray-500">
              If you believe that a child has provided personal information to us without appropriate consent, please contact us so that we can review the matter and take appropriate action where required by law.
            </p>
          </section>

          {/* 16. Sensitive Personal Information */}
          <section id="section-16" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-brand-600" /> 16. Sensitive Personal Information
            </h2>
            <p>
              We encourage users not to submit unnecessary sensitive personal information through public forms, comments, emails or other Website features. Because LoveTalk Podcast discusses relationships and emotional wellness, users may voluntarily disclose personal experiences.
            </p>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Please remember that information shared publicly may be viewed, copied or redistributed by others. Do not provide confidential information through public comments or publicly accessible areas of the Website.
            </p>
          </section>

          {/* 17. Data Sharing and Disclosure */}
          <section id="section-17" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-600" /> 17. Data Sharing and Disclosure
            </h2>
            <p>We do not intend to sell your personal information as a commercial product. We may share information where reasonably necessary with:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Technology and hosting providers.</li>
              <li>Website and analytics providers.</li>
              <li>Payment processors.</li>
              <li>Email and communication service providers.</li>
              <li>Professional advisers.</li>
              <li>Service providers supporting our operations.</li>
              <li>Legal or regulatory authorities where required.</li>
              <li>Law-enforcement authorities where legally required or reasonably necessary to protect rights and safety.</li>
            </ul>
            <p className="text-xs text-gray-500">
              Third-party service providers may process information on our behalf subject to their applicable contractual, legal and privacy obligations.
            </p>
          </section>

          {/* 18. Business Transfers */}
          <section id="section-18" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-600" /> 18. Business Transfers
            </h2>
            <p>
              If LoveTalk Podcast or its associated business operations are reorganised, merged, acquired, transferred or otherwise involved in a business transaction, relevant information may be transferred as part of that transaction, subject to applicable law. Where required, appropriate notice or consent will be provided.
            </p>
          </section>

          {/* 19. International Data Processing */}
          <section id="section-19" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-600" /> 19. International Data Processing
            </h2>
            <p>
              Because LoveTalk Podcast content and digital services may be accessible internationally, information may potentially be processed or stored in countries outside your country of residence through third-party technology and service providers. Where applicable law requires specific safeguards for international data transfers, we will seek to comply with those requirements.
            </p>
          </section>

          {/* 20. Marketing and Advertising */}
          <section id="section-20" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-600" /> 20. Marketing and Advertising
            </h2>
            <p>
              LoveTalk Podcast may use advertising, sponsorship, analytics, affiliate or promotional services. Where applicable, advertising or marketing providers may use cookies or similar technologies to measure campaigns or provide relevant advertising. You may have additional choices regarding personalised advertising through the relevant third-party platform or your device/browser settings.
            </p>
          </section>

          {/* 21. No Guarantee of Third-Party Security */}
          <section id="section-21" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-brand-600" /> 21. No Guarantee of Third-Party Security
            </h2>
            <p>
              Although we carefully consider service providers used by our Website, we cannot guarantee the security or privacy practices of third-party platforms. Users should review the privacy policies and security practices of third-party services before using them.
            </p>
          </section>

          {/* 22. Changes to This Privacy Policy */}
          <section id="section-22" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" /> 22. Changes to This Privacy Policy
            </h2>
            <p>We may update this Privacy Policy periodically to reflect:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Changes in our services.</li>
              <li>Changes in technology.</li>
              <li>Changes in applicable law.</li>
              <li>Changes in data-processing practices.</li>
              <li>Improvements to our privacy practices.</li>
            </ul>
            <p className="text-xs text-gray-500">
              The updated version will be published on this Website with a revised “Last Updated” date: <strong>22/08/2026</strong>. Your continued use of the Website after an updated Privacy Policy becomes effective may constitute acknowledgement of the updated policy, subject to applicable law.
            </p>
          </section>

          {/* 23. Relationship With Terms & Conditions */}
          <section id="section-23" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-600" /> 23. Relationship With Terms & Conditions
            </h2>
            <p>
              This Privacy Policy should be read together with the <Link href="/terms-of-service" className="text-brand-600 underline font-bold">LoveTalk Podcast Terms & Conditions</Link>. The Terms & Conditions govern your use of the Website and services, while this Privacy Policy explains our approach to personal information.
            </p>
          </section>

          {/* 24. Contact Us */}
          <section id="section-24" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-600" /> 24. Contact Us
            </h2>
            <p>
              If you have questions, concerns or requests regarding this Privacy Policy or the handling of your personal information, please contact LoveTalk Podcast through the official contact details published on our Website.
            </p>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
              <div className="font-extrabold text-base text-gray-900 dark:text-white">
                LoveTalk Podcast by Kota RJ Pawan
              </div>
              <div className="text-xs text-gray-500">
                Media flagship subsidiary of Truelove18club international luxurious wellness private limited india
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-brand-600 dark:text-brand-400">
                <Globe className="w-4 h-4 text-brand-600" />
                <span>Official Website: </span>
                <a href="http://www.lovetalkpodcast.in" target="_blank" rel="noreferrer" className="underline font-bold">
                  http://www.lovetalkpodcast.in
                </a>
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Host: Kota RJ Pawan
              </div>
            </div>
          </section>

          {/* Important Privacy Notice Box */}
          <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-2 text-amber-900 dark:text-amber-200">
            <h4 className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" /> Important Privacy Notice
            </h4>
            <p className="leading-relaxed">
              By using the LoveTalk Podcast Website, you acknowledge that you have had an opportunity to review this Privacy Policy. LoveTalk Podcast is committed to responsible handling of personal information while recognising that no online service can guarantee absolute security.
            </p>
            <p className="font-bold text-amber-800 dark:text-amber-300">
              For your own protection, please avoid submitting passwords, financial credentials, government identification numbers or other highly confidential information through public comments or unsecured communication channels.
            </p>
          </div>

        </main>
      </div>

    </div>
  );
}
