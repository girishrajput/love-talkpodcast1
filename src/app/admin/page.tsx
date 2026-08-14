'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Radio, 
  Users, 
  Headphones, 
  CheckCircle2, 
  XCircle, 
  Download, 
  FileText,
  Sparkles,
  X
} from 'lucide-react';
import { getStoredSubscribers } from '@/lib/data';
import { Episode, Language } from '@/lib/types';
import { fetchEpisodes, createEpisodeApi, updateEpisodeApi, deleteEpisodeApi } from '@/lib/api';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [subscribers, setSubscribers] = useState(getStoredSubscribers());
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [epNum, setEpNum] = useState<number>(1);
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [duration, setDuration] = useState<number>(1800);
  const [coverImg, setCoverImg] = useState('/images/podcast_cover.jpg');
  const [language, setLanguage] = useState<Language>('english');
  const [tagsInput, setTagsInput] = useState('Self-Love, Relationships');
  const [transcriptEn, setTranscriptEn] = useState('');
  const [transcriptHi, setTranscriptHi] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const eps = await fetchEpisodes({ include_drafts: true });
      setEpisodes(eps);
    } catch (err) {
      console.error('Failed to load episodes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin' || passcode === 'lovetalk' || passcode === 'lovetalk2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid admin passcode. (Try: lovetalk2026)');
    }
  };

  const autoGenerateSlug = (text: string) => {
    const generated = text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generated);
  };

  const openCreateModal = () => {
    setEditingEpisode(null);
    setTitle('');
    setEpNum(episodes.length + 1);
    setSlug('');
    setDesc('');
    setAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    setDuration(1800);
    setCoverImg('/images/podcast_cover.jpg');
    setLanguage('english');
    setTagsInput('Self-Love, Relationships');
    setTranscriptEn('');
    setTranscriptHi('');
    setIsModalOpen(true);
  };

  const openEditModal = (ep: Episode) => {
    setEditingEpisode(ep);
    setTitle(ep.title);
    setEpNum(ep.episode_number);
    setSlug(ep.slug);
    setDesc(ep.description);
    setAudioUrl(ep.audio_url);
    setDuration(ep.audio_duration);
    setCoverImg(ep.cover_image);
    setLanguage(ep.language);
    setTagsInput(ep.tags.join(', '));
    setTranscriptEn(ep.transcript_en || '');
    setTranscriptHi(ep.transcript_hi || '');
    setIsModalOpen(true);
  };

  const handleSaveEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArr = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      title,
      episode_number: epNum,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: desc,
      audio_url: audioUrl,
      audio_duration: duration,
      cover_image: coverImg,
      language,
      tags: tagsArr,
      transcript_en: transcriptEn,
      transcript_hi: transcriptHi
    };

    if (editingEpisode) {
      await updateEpisodeApi({ id: editingEpisode.id, ...payload });
    } else {
      await createEpisodeApi({ ...payload, is_published: true });
    }

    setIsModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this episode?')) {
      await deleteEpisodeApi(id);
      await loadData();
    }
  };

  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    await updateEpisodeApi({ id, is_published: !currentStatus });
    await loadData();
  };

  const exportSubscribersCSV = () => {
    const headers = ['ID', 'Email', 'Name', 'Subscribed At'];
    const rows = subscribers.map(s => [s.id, s.email, s.name || '', s.subscribed_at]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lovetalk_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-600/10 text-brand-600 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Love Talk Admin</h1>
            <p className="text-xs text-gray-500 mt-1">Enter passcode to manage episodes & subscribers</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Passcode (lovetalk2026)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-center text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
            />
            
            {authError && <p className="text-xs text-rose-500 font-semibold">{authError}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalListens = episodes.reduce((acc, curr) => acc + (curr.listens_count || 0), 0);

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-brand-950 to-gray-950 p-8 rounded-3xl text-white border border-gray-800">
        <div>
          <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Admin Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Episode Management System</h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-5 h-5" /> Add New Episode
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-1">
          <p className="text-xs text-gray-500 font-medium">Total Episodes</p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{episodes.length}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-1">
          <p className="text-xs text-gray-500 font-medium">Published Shows</p>
          <p className="text-3xl font-extrabold text-emerald-600">{episodes.filter(e => e.is_published).length}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-1">
          <p className="text-xs text-gray-500 font-medium">Total Listens</p>
          <p className="text-3xl font-extrabold text-brand-600">{totalListens.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-1">
          <p className="text-xs text-gray-500 font-medium">Subscribers</p>
          <p className="text-3xl font-extrabold text-amber-500">{subscribers.length}</p>
        </div>
      </div>

      {/* Episodes Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-extrabold text-lg text-gray-900 dark:text-white">All Podcast Episodes</h2>
          <span className="text-xs text-gray-500">Live preview enabled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-semibold">Ep #</th>
                <th className="p-4 font-semibold">Title & Slug</th>
                <th className="p-4 font-semibold">Language</th>
                <th className="p-4 font-semibold">Publish Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-800 dark:text-gray-200">
              {episodes.map((ep) => (
                <tr key={ep.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="p-4 font-bold font-mono text-brand-600">#{ep.episode_number}</td>
                  <td className="p-4 max-w-xs">
                    <p className="font-bold line-clamp-1 text-gray-900 dark:text-white">{ep.title}</p>
                    <p className="text-[11px] text-gray-400 font-mono line-clamp-1">/episodes/{ep.slug}</p>
                  </td>
                  <td className="p-4 capitalize">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      ep.language === 'hindi' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {ep.language}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(ep.publish_date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePublishStatus(ep.id, ep.is_published)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        ep.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {ep.is_published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(ep)}
                      className="p-2 text-gray-600 hover:text-brand-600 bg-gray-100 dark:bg-gray-800 rounded-lg"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ep.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Newsletter Subscribers Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-lg text-gray-900 dark:text-white">Newsletter Subscribers</h2>
            <p className="text-xs text-gray-500">{subscribers.length} total active subscribers</p>
          </div>

          <button
            onClick={exportSubscribersCSV}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400">
                <th className="py-2">Email</th>
                <th className="py-2">Name</th>
                <th className="py-2 text-right">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="py-3 font-semibold text-gray-900 dark:text-white">{s.email}</td>
                  <td className="py-3 text-gray-500">{s.name || '-'}</td>
                  <td className="py-3 text-right text-gray-400">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Episode Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <h3 className="font-extrabold text-xl text-gray-900 dark:text-white">
                {editingEpisode ? 'Edit Episode' : 'Create New Episode'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEpisode} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingEpisode) autoGenerateSlug(e.target.value);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Episode #</label>
                  <input
                    type="number"
                    required
                    value={epNum}
                    onChange={(e) => setEpNum(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Slug (SEO URL)</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Audio File URL (MP3)</label>
                  <input
                    type="text"
                    required
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Duration (seconds)</label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="bilingual">Bilingual (Hinglish)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">English Transcript</label>
                <textarea
                  rows={2}
                  value={transcriptEn}
                  onChange={(e) => setTranscriptEn(e.target.value)}
                  placeholder="[00:00] Tim: Welcome to Love Talk..."
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Hindi Transcript</label>
                <textarea
                  rows={2}
                  value={transcriptHi}
                  onChange={(e) => setTranscriptHi(e.target.value)}
                  placeholder="[00:00] टिम: लव टॉक्स पॉडकास्ट में आपका स्वागत है..."
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md"
                >
                  Save Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
