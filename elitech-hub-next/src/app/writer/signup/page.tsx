'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, User, BookOpen } from 'lucide-react';

export default function WriterSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/writer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(data.message || 'Application submitted successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Apply to become a Writer</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Join Elitech-Hub and share your cybersecurity insights.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111317] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-800">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm">
              {error}
            </div>
          )}
          {success ? (
            <div className="text-center">
              <div className="mb-4 bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded">
                {success}
              </div>
              <Link href="/writer/login" className="text-[#C3151C] hover:text-red-400 font-medium">
                Return to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-300">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 bg-[#0A0A0A] border border-gray-700 rounded-md text-white py-2 focus:ring-[#C3151C] focus:border-[#C3151C]"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 bg-[#0A0A0A] border border-gray-700 rounded-md text-white py-2 focus:ring-[#C3151C] focus:border-[#C3151C]"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="block w-full pl-10 bg-[#0A0A0A] border border-gray-700 rounded-md text-white py-2 focus:ring-[#C3151C] focus:border-[#C3151C]"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C3151C] hover:bg-red-700 focus:outline-none disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Apply Now'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <Link href="/writer/login" className="text-gray-400 hover:text-white">
              Already a writer? <span className="text-[#C3151C]">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
