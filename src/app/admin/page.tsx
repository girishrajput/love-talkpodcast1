'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  X,
  UploadCloud,
  Music,
  ImageIcon,
  Loader2,
  AlertCircle,
  RefreshCw,
  FileAudio,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { getStoredSubscribers } from '@/lib/data';
import { Episode, Language } from '@/lib/types';
import { fetchEpisodes, createEpisodeApi, updateEpisodeApi, deleteEpisodeApi } from '@/lib/api';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

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

  // Upload States
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioFileDetails, setAudioFileDetails] = useState<{ name: string; size: number } | null>(null);
  const [audioError, setAudioError] = useState('');

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverFileDetails, setCoverFileDetails] = useState<{ name: string; size: number } | null>(null);
  const [coverError, setCoverError] = useState('');

  const [showManualAudioInput, setShowManualAudioInput] = useState(false);
  const [showManualCoverInput, setShowManualCoverInput] = useState(false);

  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

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

  const resetUploadStates = () => {
    setIsUploadingAudio(false);
    setAudioFileDetails(null);
    setAudioError('');
    setIsUploadingCover(false);
    setCoverFileDetails(null);
    setCoverError('');
    setShowManualAudioInput(false);
    setShowManualCoverInput(false);
  };

  const openCreateModal = () => {
    resetUploadStates();
    setEditingEpisode(null);
    setTitle('');
    setEpNum(episodes.length + 1);
    setSlug('');
    setDesc('');
    setAudioUrl('');
    setDuration(1800);
    setCoverImg('/images/podcast_cover.jpg');
    setLanguage('english');
    setTagsInput('Self-Love, Relationships');
    setTranscriptEn('');
    setTranscriptHi('');
    setIsModalOpen(true);
  };

  const openEditModal = (ep: Episode) => {
    resetUploadStates();
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

  // Upload File Handler (MP3 or Image)
  const handleFileUpload = async (file: File, type: 'audio' | 'image') => {
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (type === 'audio') {
      if (ext !== 'mp3' && file.type !== 'audio/mpeg' && file.type !== 'audio/mp3') {
        setAudioError('Invalid audio file type. Only MP3 (.mp3) files are supported.');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setAudioError(`File size (${formatBytes(file.size)}) exceeds the 50MB maximum limit.`);
        return;
      }
      setAudioError('');
      setIsUploadingAudio(true);
      setAudioFileDetails({ name: file.name, size: file.size });
    } else {
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext) && !file.type.startsWith('image/')) {
        setCoverError('Invalid image file type. Only JPG, JPEG, PNG, and WebP images are allowed.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setCoverError(`File size (${formatBytes(file.size)}) exceeds the 10MB maximum limit.`);
        return;
      }
      setCoverError('');
      setIsUploadingCover(true);
      setCoverFileDetails({ name: file.name, size: file.size });
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Upload failed');
      }

      if (type === 'audio') {
        setAudioUrl(json.url);
        setIsUploadingAudio(false);
      } else {
        setCoverImg(json.url);
        setIsUploadingCover(false);
      }
    } catch (err: any) {
      console.error('Upload Error:', err);
      if (type === 'audio') {
        setAudioError(err.message || 'Audio upload failed. Please try again.');
        setIsUploadingAudio(false);
        setAudioFileDetails(null);
      } else {
        setCoverError(err.message || 'Image upload failed. Please try again.');
        setIsUploadingCover(false);
        setCoverFileDetails(null);
      }
    }
  };

  const handleSaveEpisode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioUrl) {
      setAudioError('Please upload an MP3 audio file or enter an audio URL.');
      return;
    }

    const tagsArr = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      title,
      episode_number: epNum,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: desc,
      audio_url: audioUrl,
      audio_duration: duration,
      cover_image: coverImg || '/images/podcast_cover.jpg',
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
                <th className="p-4 font-semibold">Title & Cover</th>
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
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-800 border">
                        <Image
                          src={ep.cover_image || '/images/podcast_cover.jpg'}
                          alt={ep.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold line-clamp-1 text-gray-900 dark:text-white">{ep.title}</p>
                        <p className="text-[11px] text-gray-400 font-mono line-clamp-1">/episodes/{ep.slug}</p>
                      </div>
                    </div>
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

            <form onSubmit={handleSaveEpisode} className="space-y-5 text-xs sm:text-sm">
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

              {/* ===== EPISODE AUDIO (MP3) UPLOAD FIELD ===== */}
              <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Music className="w-4 h-4 text-brand-500" /> Episode Audio (MP3) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowManualAudioInput(!showManualAudioInput)}
                    className="text-[11px] font-semibold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <LinkIcon className="w-3 h-3" /> {showManualAudioInput ? 'Use File Upload' : 'Enter URL Manually'}
                  </button>
                </div>

                {/* Uploaded Audio Preview Card */}
                {audioUrl && !isUploadingAudio && !showManualAudioInput ? (
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          <FileAudio className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                            {audioFileDetails?.name || audioUrl.split('/').pop()}
                          </p>
                          <p className="text-[11px] text-gray-400 font-mono">
                            {audioFileDetails ? formatBytes(audioFileDetails.size) : 'Uploaded Audio Source'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => audioFileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAudioUrl('');
                            setAudioFileDetails(null);
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
                          title="Remove Audio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Audio Player Preview */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                      <audio controls src={audioUrl} className="w-full h-8" />
                    </div>
                  </div>
                ) : isUploadingAudio ? (
                  /* Audio Uploading State */
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-brand-500/40 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-brand-600 animate-spin flex-shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-white">Uploading MP3 file...</p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {audioFileDetails ? `${audioFileDetails.name} (${formatBytes(audioFileDetails.size)})` : 'Please wait'}
                      </p>
                    </div>
                  </div>
                ) : showManualAudioInput ? (
                  /* Manual Audio URL Input */
                  <div>
                    <input
                      type="text"
                      placeholder="https://example.com/audio.mp3 or /uploads/audio/..."
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-xs"
                    />
                  </div>
                ) : (
                  /* File Upload Dropzone */
                  <div
                    onClick={() => audioFileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-500 rounded-xl p-5 text-center bg-white dark:bg-gray-900 cursor-pointer transition-colors space-y-2 group"
                  >
                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-brand-500 mx-auto transition-colors" />
                    <div>
                      <p className="font-bold text-xs text-gray-800 dark:text-gray-200">
                        Click to upload Episode MP3 Audio
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        MP3 files only, maximum file size 50MB
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={audioFileInputRef}
                  type="file"
                  accept=".mp3,audio/mpeg,audio/mp3"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'audio');
                  }}
                />

                {audioError && (
                  <p className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {audioError}
                  </p>
                )}
              </div>

              {/* ===== EPISODE BANNER / COVER IMAGE UPLOAD FIELD ===== */}
              <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-brand-500" /> Episode Banner / Cover Image
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowManualCoverInput(!showManualCoverInput)}
                    className="text-[11px] font-semibold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <LinkIcon className="w-3 h-3" /> {showManualCoverInput ? 'Use File Upload' : 'Enter URL Manually'}
                  </button>
                </div>

                {/* Uploaded Cover Image Preview Card */}
                {coverImg && !isUploadingCover && !showManualCoverInput ? (
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border bg-gray-100">
                        <Image
                          src={coverImg}
                          alt="Cover Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                          {coverFileDetails?.name || coverImg.split('/').pop()}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono">
                          {coverFileDetails ? formatBytes(coverFileDetails.size) : 'Banner Image Active'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => coverFileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImg('/images/podcast_cover.jpg');
                          setCoverFileDetails(null);
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
                        title="Reset Cover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : isUploadingCover ? (
                  /* Cover Uploading State */
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-brand-500/40 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-brand-600 animate-spin flex-shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-white">Uploading Cover Image...</p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {coverFileDetails ? `${coverFileDetails.name} (${formatBytes(coverFileDetails.size)})` : 'Please wait'}
                      </p>
                    </div>
                  </div>
                ) : showManualCoverInput ? (
                  /* Manual Cover URL Input */
                  <div>
                    <input
                      type="text"
                      placeholder="https://example.com/cover.jpg or /images/..."
                      value={coverImg}
                      onChange={(e) => setCoverImg(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-xs"
                    />
                  </div>
                ) : (
                  /* File Upload Dropzone */
                  <div
                    onClick={() => coverFileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-500 rounded-xl p-4 text-center bg-white dark:bg-gray-900 cursor-pointer transition-colors space-y-1.5 group"
                  >
                    <UploadCloud className="w-7 h-7 text-gray-400 group-hover:text-brand-500 mx-auto transition-colors" />
                    <div>
                      <p className="font-bold text-xs text-gray-800 dark:text-gray-200">
                        Click to upload Custom Banner / Cover Image
                      </p>
                      <p className="text-[11px] text-gray-400">
                        JPG, PNG, WebP images, maximum file size 10MB
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={coverFileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'image');
                  }}
                />

                {coverError && (
                  <p className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {coverError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  disabled={isUploadingAudio || isUploadingCover}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {(isUploadingAudio || isUploadingCover) && <Loader2 className="w-4 h-4 animate-spin" />}
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
