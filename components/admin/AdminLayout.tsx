'use client';

import { useAuth } from '@/components/auth-provider';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push('/auth/login?redirect=' + encodeURIComponent(pathname || '/admin'));
        return;
      }
      
      // If authenticated but not admin, redirect to home
      if (!isAdmin) {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 