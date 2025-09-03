'use client';

import React, { useEffect, useState } from 'react';
import '@/app/globals.css';
import Navbar from '@/components/shared/Navbar';
import Header from '@/components/shared/Header';
import { Poppins } from 'next/font/google';
import { useRouter, usePathname } from 'next/navigation';
import { gql, useLazyQuery } from '@apollo/client';

const poppins = Poppins({
  weight: ['100','200','300','400','500','600','700','800','900'],
  subsets: ['latin'],
  display: 'swap',
});

type AdminUser = {
  id?: number | string;
  name?: string;
  username?: string;
  profilePicturePath?: string | null;
};

const GET_LOG_USER_BY_ID = gql`
  query GetUserById($id: Int!) {
    userById(id: $id) {
      id
      name
      username
      profilePicturePath
    }
  }
`;

function hasAuth() {
  try {
    const jwt = localStorage.getItem('resq.admin.jwt');
    const admin = localStorage.getItem('resq.admin');
    if (!jwt || !admin) return false;
    JSON.parse(admin);
    return true;
  } catch {
    return false;
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Lazy query so we can trigger only after reading localStorage
  const [fetchUserById, { data, error }] = useLazyQuery(GET_LOG_USER_BY_ID, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (!hasAuth()) {
      router.replace('/auth/login');
      return;
    }
    if (pathname === '/admin') {
      router.replace('/admin/dashboard');
      return;
    }

    // Load user from localStorage and fetch latest
    try {
      const raw = localStorage.getItem('resq.admin');
      if (raw) {
        const parsed: AdminUser = JSON.parse(raw);
        setUser(parsed);

        const idNum =
          typeof parsed?.id === 'string' ? parseInt(parsed.id as string, 10) : (parsed?.id as number | undefined);

        if (idNum && Number.isFinite(idNum)) {
          fetchUserById({ variables: { id: idNum } });
        }
      }
    } catch {
      // ignore parse errors; user will still be redirected by hasAuth next time
    }

    setReady(true);
  }, [router, pathname, fetchUserById]);

  // On successful fetch, update state + localStorage
  useEffect(() => {
    if (data?.userById) {
      const updated = data.userById;
      setUser(updated);
      localStorage.setItem('resq.admin', JSON.stringify(updated));
    }
  }, [data]);

  // If unauthorized, clear and bounce to login
  useEffect(() => {
    if (error) {
      const msg = (error.message || '').toLowerCase();
      if (msg.includes('unauth') || msg.includes('forbidden')) {
        localStorage.removeItem('resq.admin.jwt');
        localStorage.removeItem('resq.admin');
        router.replace('/auth/login');
      }
    }
  }, [error, router]);

  const handleToggle = () => setSidebarCollapsed((prev) => !prev);
  const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev);

  const logout = () => {
    localStorage.removeItem('resq.admin.jwt');
    localStorage.removeItem('resq.admin');
    router.replace('/auth/login');
  };

  if (!ready) return null; // or a loader

  return (
    <div className={`h-screen flex ${poppins.className} overflow-hidden`}>
      {/* Sidebar */}
      <div
        className={`hidden md:block transition-all duration-300 border-r border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <Navbar
          collapsed={sidebarCollapsed}
          onToggle={handleToggle}
          user={user ?? undefined}
          onLogout={logout}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 h-full bg-white dark:bg-neutral-800 shadow-xl">
            <Navbar
              collapsed={false}
              onToggle={() => setMobileSidebarOpen(false)}
              user={user ?? undefined}
              onLogout={logout}
            />
          </div>
        </div>
      )}

      {/* Right Side (Header + Content) */}
      <div className="flex flex-col flex-1 h-full">
        <Header onMobileToggle={toggleMobileSidebar} />
        <main className="flex-1 overflow-y-auto p-2 bg-gray-50 dark:bg-neutral-900">
          {children}
        </main>
      </div>
    </div>
  );
}
