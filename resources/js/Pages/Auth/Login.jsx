import { useForm } from '@inertiajs/react';
import { Users, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const { data, setData, post, processing, errors } = useForm({ email: 'admin@peopleflow.com', password: 'password', remember: false });

  const submit = (e) => { e.preventDefault(); post('/login'); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500 mb-4 shadow-lg">
              <Users size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">PeopleFlow</h1>
            <p className="text-indigo-300 text-sm mt-1">Human Resource Management System</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1.5">Email Address</label>
              <input
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm"
                placeholder="admin@peopleflow.com"
              />
              {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-indigo-200 cursor-pointer">
                <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="rounded border-white/30 bg-white/10 text-indigo-500" />
                Remember me
              </label>
              <a href="#" className="text-sm text-indigo-300 hover:text-white transition">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-indigo-300 font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-indigo-200">
              <div className="flex justify-between"><span>Admin:</span><span className="font-mono">admin@peopleflow.com</span></div>
              <div className="flex justify-between"><span>Password:</span><span className="font-mono">password</span></div>
            </div>
          </div>
        </div>

        <p className="text-center text-indigo-400 text-xs mt-6">
          © 2026 PeopleFlow · Manage people, payroll & performance.
        </p>
      </div>
    </div>
  );
}
