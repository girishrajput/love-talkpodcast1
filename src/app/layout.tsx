import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AudioProvider } from '@/context/AudioContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AudioPlayer } from '@/components/AudioPlayer';

export const metadata: Metadata = {
  metadataBase: new URL('https://lovetalkpodcast.in'),
  title: 'Love Talk Podcast | Tim & Chels | Relationship & Emotional Wellness',
  description: "Welcome to 'Love Talk' Podcast with Tim & Chels! Discussing dating, relationship psychology, overthinking, and self-love for young adults in India and worldwide.",
  keywords: ['Love Talk Podcast', 'Tim and Chels', 'Relationship Advice India', 'Podcast', 'Hindi Podcast', 'Self Love', 'Couples Podcast'],
  authors: [{ name: 'Tim & Chels' }],
  openGraph: {
    title: 'Love Talk Podcast | Tim & Chels',
    description: "Welcome to 'Love Talk' Podcast! We're glad that you are here. New episodes every Friday.",
    url: 'https://lovetalkpodcast.in',
    siteName: 'Love Talk Podcast',
    images: [
      {
        url: '/images/podcast_cover.jpg',
        width: 1200,
        height: 1200,
        alt: 'Love Talk Podcast Cover',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Love Talk Podcast with Tim & Chels',
    description: 'Relationship advice, emotional wellness, and modern dating topics in English and Hindi.',
    images: ['/images/podcast_cover.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col justify-between">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <AudioProvider>
                {/* Structured JSON-LD Data for Podcast */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': 'PodcastSeries',
                      name: 'Love Talk Podcast',
                      author: {
                        '@type': 'Person',
                        name: 'Tim & Chels',
                      },
                      description: "Welcome to 'Love Talk' Podcast! Discussing relationships, mental health, and emotional wellness.",
                      url: 'https://lovetalkpodcast.in',
                      inLanguage: ['en', 'hi'],
                      image: 'https://lovetalkpodcast.in/images/podcast_cover.jpg',
                    }),
                  }}
                />
                
                <Navbar />
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {children}
                </main>
                <Footer />
                <AudioPlayer />
              </AudioProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
