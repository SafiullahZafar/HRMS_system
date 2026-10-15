import { useForm, Link } from '@inertiajs/react';
import { Users, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl shadow-blue-100/60">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-4 shadow-sm border border-blue-100/80">
              <Users size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-950 tracking-tight">PeopleFlow</h1>
            <p className="text-gray-500 text-sm mt-1">Enterprise Human Resource Management System</p>
          </div>

          <form onSubmit={submit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm shadow-sm"
                placeholder="name@company.com"
                required
              />
              {errors.email && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white border border-gray-300 text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm shadow-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition p-1"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={e => setData('remember', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {processing ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Instant Demo Access (No credentials required) */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-100 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
                <Sparkles size={14} className="text-blue-600" />
                Live Demo Experience
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Experience the full HRMS system with 7+ rich records in each module. No credentials needed.
              </p>
              <a
                href="/demo"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-transparent font-medium text-xs transition-all shadow-sm group"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 PeopleFlow · Enterprise HR, Attendance & Payroll System
        </p>
      </div>
    </div>
  );
}
