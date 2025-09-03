// app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const authed =
      !!localStorage.getItem('resq.admin.jwt') &&
      !!localStorage.getItem('resq.admin');
    router.replace(authed ? '/admin/dashboard' : '/auth/login');
  }, [router]);
  return null;
}
