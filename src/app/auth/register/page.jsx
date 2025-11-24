'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerStart } from '../../../store/slices/authSlice';
import Link from 'next/link';
import Footer from '../../../components/Footer';
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    dispatch(registerStart(formData));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-base-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 w-full h-full bg-base-200">
        <div className="absolute top-[-10%] right-[20%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-200/50 backdrop-blur-sm">
          <div className="card-body p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-base-content mb-2 tracking-tight">
                Create Account
              </h2>
              <div className="h-6 flex items-center justify-center">
                <p className={`text-primary font-medium transition-all duration-300 ${formData.name ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-0'}`}>
                  {formData.name ? (
                    <span className="flex items-center gap-2">
                      Welcome, {formData.name.split(' ')[0]} <span className="animate-bounce">🚀</span>
                    </span>
                  ) : (
                    'Join our community today'
                  )}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label px-1">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="input input-bordered w-full pl-10 focus:input-primary bg-base-200/50 focus:bg-base-100 transition-all"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label px-1">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full pl-10 focus:input-primary bg-base-200/50 focus:bg-base-100 transition-all"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label px-1">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 focus:input-primary bg-base-200/50 focus:bg-base-100 transition-all"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label px-1">
                  <span className="label-text font-medium">Confirm Password</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 focus:input-primary bg-base-200/50 focus:bg-base-100 transition-all"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-error shadow-sm rounded-lg border border-error/20 text-sm py-3">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </>
                )}
              </button>
            </form>

            <div className="divider text-base-content/30 text-sm my-6">OR</div>

            <div className="text-center">
              <p className="text-base-content/70">
                Already have an account?{' '}
                <Link href="/auth/login" className="link link-primary font-bold hover:link-hover transition-colors">
                  Sign In
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
