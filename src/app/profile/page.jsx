'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.username) {
      router.replace(`/profile/${user.username}`);
    } else {
      // Fallback if username is missing for some reason
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
}
