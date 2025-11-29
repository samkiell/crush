'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { showErrorToast, showRegistrationSuccessToast } from '../../utils/toast-helpers';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [mounted, setMounted] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        setMounted(true);

        // Cleanup on unmount
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    // Redirect authenticated users to dashboard
    useEffect(() => {
        if (isAuthenticated && user) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, user, router]);

    // Watch for registration success
    const [registerSuccess, setRegisterSuccess] = useState(false);

    useEffect(() => {
        if (registerSuccess && !loading && !error) {
            // Show success toast and redirect to login
            showRegistrationSuccessToast();
            setTimeout(() => {
                router.push('/login');
            }, 1000);
        }
    }, [registerSuccess, loading, error, router]);

    // Display error toast when error changes
    useEffect(() => {
        if (error) {
            showErrorToast(error);
        }
    }, [error]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear password error when user types
        if (passwordError && (e.target.name === 'password' || e.target.name === 'confirmPassword')) {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            const errorMsg = 'The two passwords no be the same. Check am again';
            setPasswordError(errorMsg);
            showErrorToast(errorMsg);
            return;
        }

        if (formData.password.length < 6) {
            const errorMsg = 'Password too short, do better. At least 6 characters abeg';
            setPasswordError(errorMsg);
            showErrorToast(errorMsg);
            return;
        }

        // Dispatch register action
        const result = await dispatch(registerUser({
            name: formData.name,
            email: formData.email,
            password: formData.password,
        }));

        // Check if registration was successful
        if (registerUser.fulfilled.match(result)) {
            setRegisterSuccess(true);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex flex-col bg-base-200 relative transition-colors duration-300">
            {/* Background decoration */}
            <div className="fixed inset-0 w-full h-full bg-base-200 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[20%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
            </div>

            <main className="flex-grow flex items-center justify-center p-4 sm:p-6 relative z-10">
                <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-content/5">
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
                                <label className="label px-4">
                                    <span className="label-text font-medium text-base-content/80">Full Name</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        className="input input-bordered w-full pl-11 rounded-full bg-base-200 focus:bg-base-100 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

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
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="input input-bordered w-full pl-11 rounded-full bg-base-200 focus:bg-base-100 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label px-4">
                                    <span className="label-text font-medium text-base-content/80">Confirm Password</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        className="input input-bordered w-full pl-11 rounded-full bg-base-200 focus:bg-base-100 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {passwordError && (
                                <div className="alert alert-error shadow-sm rounded-2xl border border-error/20 text-sm py-3">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <span>{passwordError}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary w-full rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 mt-4 text-lg font-medium flex items-center justify-center gap-2"
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
                                Already have an account?{' '}
                                <Link href="/login" className="link link-primary font-bold hover:link-hover transition-colors">
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
