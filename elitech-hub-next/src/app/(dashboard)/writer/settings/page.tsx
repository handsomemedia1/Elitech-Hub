'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Link as LinkIcon, Briefcase, MapPin, Upload } from 'lucide-react';

export default function WriterSettings() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('elitech_token');
    if (!token) {
      router.push('/writer/login');
      return;
    }

    fetch('/api/writer/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.writer) {
          setProfile(data.writer);
        } else {
          setMessage('Error loading profile');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const token = localStorage.getItem('elitech_token');
    try {
      const res = await fetch('/api/writer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully!');
        setProfile(data.writer);
      } else {
        setMessage(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setMessage('Error saving profile');
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('elitech_token');
    try {
      const res = await fetch('/api/writer/upload-avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setProfile({ ...profile, avatar_url: data.url });
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Error uploading avatar');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading profile...</div>;

  const calculateCompletion = () => {
    const fields = ['display_name', 'professional_title', 'bio', 'full_bio', 'avatar_url', 'expertise'];
    const filled = fields.filter(f => profile?.[f] && profile?.[f].length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completion = calculateCompletion();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-white">
      <h1 className="text-3xl font-bold mb-2">Writer Settings</h1>
      <p className="text-gray-400 mb-8">Manage your editorial identity and public author profile.</p>

      {message && (
        <div className={`p-4 rounded mb-6 ${message.includes('success') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {message}
        </div>
      )}

      {completion < 100 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mb-8">
          <h3 className="text-yellow-500 font-semibold mb-1">Complete your writer profile ({completion}%)</h3>
          <p className="text-sm text-yellow-500/80 mb-3">Add your professional title, bio, expertise, photo and professional links so readers can identify you as the author of your work.</p>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${completion}%` }}></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-[#111317] border border-gray-800 rounded-xl p-6 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-800 overflow-hidden border border-gray-700 shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <User size={32} />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Profile Photo</h3>
            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium transition flex items-center gap-2 inline-flex">
              <Upload size={16} />
              Upload Photo
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} />
            </label>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG or WebP, max 2MB.</p>
          </div>
        </div>

        <div className="bg-[#111317] border border-gray-800 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-semibold border-b border-gray-800 pb-3">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input type="text" name="name" value={profile?.name || ''} readOnly className="w-full bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
              <input type="text" name="display_name" value={profile?.display_name || ''} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#C3151C] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Professional Title</label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-3 text-gray-500" />
                <input type="text" name="professional_title" value={profile?.professional_title || ''} onChange={handleChange} placeholder="e.g. Senior Security Researcher" className="w-full bg-[#0A0A0A] border border-gray-700 rounded pl-10 pr-3 py-2 text-white focus:border-[#C3151C] focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-gray-500" />
                <input type="text" name="location" value={profile?.location || ''} onChange={handleChange} placeholder="e.g. Lagos, Nigeria" className="w-full bg-[#0A0A0A] border border-gray-700 rounded pl-10 pr-3 py-2 text-white focus:border-[#C3151C] focus:outline-none" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Short Bio</label>
            <textarea name="bio" value={profile?.bio || ''} onChange={handleChange} rows={2} maxLength={160} placeholder="A short 1-2 sentence description..." className="w-full bg-[#0A0A0A] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#C3151C] focus:outline-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Bio</label>
            <textarea name="full_bio" value={profile?.full_bio || ''} onChange={handleChange} rows={5} placeholder="Your complete editorial bio..." className="w-full bg-[#0A0A0A] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#C3151C] focus:outline-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Expertise (Comma separated)</label>
            <input type="text" name="expertise" value={profile?.expertise?.join(', ') || ''} onChange={(e) => setProfile({...profile, expertise: e.target.value.split(',').map(s=>s.trim())})} placeholder="Penetration Testing, Cloud Security, AI" className="w-full bg-[#0A0A0A] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#C3151C] focus:outline-none" />
          </div>
        </div>

        <div className="bg-[#111317] border border-gray-800 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-semibold border-b border-gray-800 pb-3">Professional Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn URL</label>
              <input type="url" name="linkedin_url" value={profile?.linkedin_url || ''} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#C3151C] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Portfolio URL</label>
              <input type="url" name="portfolio_url" value={profile?.portfolio_url || ''} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#C3151C] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Personal Website</label>
              <input type="url" name="website_url" value={profile?.website_url || ''} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#C3151C] focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Account Details</h3>
          <div className="text-sm text-gray-400 space-y-2">
            <p><span className="font-medium text-gray-300">Email:</span> {profile?.email}</p>
            <p><span className="font-medium text-gray-300">Status:</span> <span className="capitalize text-green-500">{profile?.status}</span></p>
            <p><span className="font-medium text-gray-300">Author Slug:</span> {profile?.slug || 'Will be generated on save'}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="bg-[#C3151C] hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
