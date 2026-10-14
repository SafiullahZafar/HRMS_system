import { useForm } from '@inertiajs/react';
import { Users, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const { data, setData, post, processing, errors } = useForm({ email: 'admin@peopleflow.com', password: 'password', remember: false });

  const submit = (e) => { e.preventDefault(); post('/login'); };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl shadow-blue-100/60">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-4">
              <Users size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-950">PeopleFlow</h1>
            <p className="text-gray-500 text-sm mt-1">Human Resource Management System</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                placeholder="admin@peopleflow.com"
              />
              {errors.email && <p className="text-blue-600 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white border border-gray-300 text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-blue-600 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Remember me
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-gray-600 font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-700">
              <div className="flex justify-between"><span>Admin:</span><span className="font-mono">admin@peopleflow.com</span></div>
              <div className="flex justify-between"><span>Password:</span><span className="font-mono">password</span></div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 PeopleFlow · Manage people, payroll & performance.
        </p>
      </div>
    </div>
  );
}
