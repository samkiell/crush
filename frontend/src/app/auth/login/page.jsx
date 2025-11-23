'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginStart } from '../../../store/slices/authSlice';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold text-center justify-center mb-2">
              Welcome Back
            </h2>

            <p className="text-center text-lg font-medium text-primary mb-6 min-h-[1.75rem]">
              {formData.email ? `Welcome ${formData.email}` : 'Sign in to continue'}
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  className="input input-bordered w-full focus:input-primary"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full focus:input-primary"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label className="label">
                  <Link href="/auth/forgot-password" className="label-text-alt link link-hover text-primary">
                    Forgot password?
                  </Link>
                </label>
              </div>

              {error && (
                <div className="alert alert-error text-sm mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-base-content/70">
                Don't have an account?{' '}
                <Link href="/auth/register" className="link link-primary font-semibold hover:link-hover">
                  Sign up
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
