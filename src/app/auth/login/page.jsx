'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginStart } from '../../../store/slices/authSlice';
import Footer from '../../../components/Footer';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginStart(formData));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-base-200 relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 w-full h-full bg-base-200">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-xl shadow-2xl border border-base-content/5">
          <div className="card-body p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-base-content mb-2 tracking-tight">
                Welcome Back
              </h2>
              <div className="h-6 flex items-center justify-center">
                <p className={`text-primary font-medium transition-all duration-300 ${formData.email ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-0'}`}>
                  {formData.email ? (
                    <span className="flex items-center gap-2">
                      Hello, {formData.email.split('@')[0]} <span className="animate-pulse">👋</span>
                    </span>
                  ) : (
                    'Sign in to your account'
                  )}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-control">
                <label className="label px-4">
                  <span className="label-text font-medium text-base-content/80">Email Address</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full pl-11 rounded-full bg-base-200/50 focus:bg-base-100 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label px-4">
                  <span className="label-text font-medium text-base-content/80">Password</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-11 rounded-full bg-base-200/50 focus:bg-base-100 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <label className="label px-4 mt-1">
                  <Link
                    href="/auth/forgot-password"
                    className="label-text-alt link link-primary hover:link-hover font-medium ml-auto"
                  >
                    Forgot password?
                  </Link>
                </label>
              </div>

              {error && (
                <div className="alert alert-error shadow-sm rounded-2xl border border-error/20 text-sm py-3">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 mt-2 text-lg font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>

                    <ArrowRight className="h-5 w-5 ml-1" />
                      Sign In
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-base-content/10"></div>
              <span className="flex-shrink-0 mx-4 text-base-content/50 text-sm font-medium">OR</span>
              <div className="flex-grow border-t border-base-content/10"></div>
            </div>

            <div className="text-center">
              <p className="text-base-content/70">
                Don't have an account?{' '}
                <Link href="/auth/register" className="link link-primary font-bold hover:link-hover transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
