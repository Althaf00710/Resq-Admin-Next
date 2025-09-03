'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/components-page/auth/LoginForm';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem('resq.admin.jwt');
    const admin = localStorage.getItem('resq.admin');
    if (jwt && admin) router.replace('/admin/dashboard');
  }, [router]);

  return <LoginPage />;
}
