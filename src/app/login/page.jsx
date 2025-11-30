'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser, clearError } from '../../store/slices/authSlice';
import Footer from '../../components/Footer';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { showErrorToast, showWelcomeToast } from '../../utils/toast-helpers';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const loginAttempted = useRef(false);

  useEffect(() => {
    setMounted(true);

    // Cleanup on unmount
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user && !loginAttempted.current) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  // Watch for login success and redirect to dashboard  
  useEffect(() => {
    // Only redirect if user actually tried to log in, not from auth initialization
    if (isAuthenticated && user && !loading && loginAttempted.current) {
      // Show welcome toast with username
      const username = user.username || user.name || user.email?.split('@')[0] || 'User';
      showWelcomeToast(username);

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    }
  }, [isAuthenticated, user, loading, router]);

  // Display error toast when error changes
  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginAttempted.current = true;

    // Dispatch login action
    await dispatch(loginUser(formData));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-base-200 relative transition-colors duration-300">
      {/* Background decoration */}
      <div className="fixed inset-0 w-full h-full bg-base-200 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-content/5">
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
                  <span className="label-text font-medium text-base-content/80">Email or Username</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/70 group-focus-within:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="email"
                    placeholder="email or username"
                    className="input input-bordered w-full pl-11 rounded-full bg-base-200 focus:bg-base-100 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
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
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/70 group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-11 pr-12 rounded-full bg-base-200 focus:bg-base-100 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/70 hover:text-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between px-4 mt-2">
                  <label className="cursor-pointer flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="checkbox checkbox-primary checkbox-sm rounded-md"
                    />
                    <span className="label-text font-medium text-base-content/80 text-sm">Remember me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="label-text-alt link link-primary hover:link-hover font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 mt-2 text-lg font-medium flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5" />
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
                <Link href="/register" className="link link-primary font-bold hover:link-hover transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main >

      <Footer />
    </div >
  );
}
