'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const DICTIONARY: Translations = {
  navHome: { en: 'Home', hi: 'होम' },
  navEpisodes: { en: 'Episodes', hi: 'एपिसोड्स' },
  navSearch: { en: 'Search', hi: 'खोजें' },
  navAbout: { en: 'About Us', hi: 'हमारे बारे में' },
  navAdmin: { en: 'Admin Dashboard', hi: 'एडमिन डैशबोर्ड' },
  
  heroTagline: { en: 'Love Talk Podcast with Tim & Chels', hi: 'टिम और चेल्स के साथ लव टॉक्स पॉडकास्ट' },
  heroTitle: { en: 'Welcome to Love Talk! We are glad you are here.', hi: 'लव टॉक्स में आपका स्वागत है! हमें खुशी है कि आप यहाँ हैं।' },
  heroSubtitle: { 
    en: 'Navigating relationships, emotional wellness, self-love, and modern dating for young adults across India & beyond. New episodes every Friday.', 
    hi: 'युवाओं के लिए रिश्तों, आत्म-प्रेम, मानसिक स्वास्थ्य और मॉडर्न डेटिंग की गहरी समझ। हर शुक्रवार नया एपिसोड।' 
  },
  
  btnListenLatest: { en: 'Listen Latest Episode', hi: 'नवीनतम एपिसोड सुनें' },
  btnExploreAll: { en: 'Explore Episodes', hi: 'सभी एपिसोड देखें' },
  btnSubscribe: { en: 'Subscribe on Platforms', hi: 'प्लेटफॉर्म्स पर सब्सक्राइब करें' },
  btnTelegram: { en: 'Join Telegram Community', hi: 'टेलीग्राम पर जुड़ें' },
  btnInstagram: { en: 'Follow on Instagram', hi: 'इंस्टाग्राम पर फॉलो करें' },
  
  latestEpisodeTag: { en: 'LATEST RELEASE', hi: 'नवीनतम रिलीज़' },
  featuredTitle: { en: 'Featured Episode Spotlight', hi: 'मुख्य एपिसोड' },
  allEpisodesTitle: { en: 'Browse Podcast Episodes', hi: 'पॉडकास्ट एपिसोड्स ब्राउज़ करें' },
  
  filterAllLang: { en: 'All Languages', hi: 'सभी भाषाएं' },
  filterEnglish: { en: 'English Only', hi: 'केवल अंग्रेजी' },
  filterHindi: { en: 'Hindi Special (हिंदी)', hi: 'हिंदी विशेष' },
  filterBilingual: { en: 'Bilingual (Hinglish)', hi: 'द्विभाषी (Hinglish)' },
  
  hostsTitle: { en: 'Meet Your Hosts: Tim & Chels', hi: 'अपने होस्ट्स से मिलें: टिम और चेल्स' },
  hostsSubtitle: { 
    en: 'Real conversations, genuine stories, and practical relationship guidance from a couple who walks the journey with you.', 
    hi: 'सच्ची बातें, वास्तविक अनुभव और रिश्तों के लिए व्यावहारिक मार्गदर्शन।' 
  },
  
  newsletterTitle: { en: 'Join the Love Talk Inner Circle', hi: 'लव टॉक्स इनर सर्कल से जुड़ें' },
  newsletterSubtitle: { en: 'Get weekly episode summaries, secret relationship tips, and community Q&As in your inbox every Friday.', hi: 'हर शुक्रवार साप्ताहिक पॉडकास्ट समरी और स्पेशल टिप्स अपने इनबॉक्स में पाएं।' },
  newsletterPlaceholder: { en: 'Enter your email address...', hi: 'अपना ईमेल पता दर्ज करें...' },
  newsletterBtn: { en: 'Subscribe Now', hi: 'अभी सब्सक्राइब करें' },
  newsletterSuccess: { en: 'Thank you for subscribing! Welcome to the family.', hi: 'सब्सक्राइब करने के लिए धन्यवाद! परिवार में आपका स्वागत है।' },

  commentsTitle: { en: 'Listener Discussions & Ratings', hi: 'श्रोताओं की चर्चा और रेटिंग' },
  addCommentBtn: { en: 'Post Comment', hi: 'कमेंट पोस्ट करें' },
  
  transcriptTab: { en: 'Transcript / स्क्रिप्ट', hi: 'स्क्रिप्ट / Transcript' },
  showNotesTab: { en: 'Show Notes & Links', hi: 'शो नोट्स और लिंक्स' },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lovetalk_lang') as Lang;
      if (saved === 'en' || saved === 'hi') setLangState(saved);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lovetalk_lang', l);
    }
  };

  const t = (key: string): string => {
    if (!DICTIONARY[key]) return key;
    return DICTIONARY[key][lang] || DICTIONARY[key]['en'];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
