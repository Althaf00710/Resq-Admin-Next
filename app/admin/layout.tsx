'use client';

import React, { useState } from 'react';
import '@/app/globals.css';
import Navbar from '@/components/shared/Navbar';
import Header from '@/components/shared/Header';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleToggle = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`h-screen flex ${poppins.className} overflow-hidden`}>
      {/* Sidebar */}
      <div
        className={`hidden md:block transition-all duration-300 border-r border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 ${
          sidebarCollapsed ? 'w-17' : 'w-62'
        }`}
      >
        <Navbar collapsed={sidebarCollapsed} onToggle={handleToggle} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 h-full bg-white dark:bg-neutral-800 shadow-xl">
            <Navbar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Right Side (Header + Content) */}
      <div className="flex flex-col flex-1 h-full">
        <Header onMobileToggle={toggleMobileSidebar} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-neutral-900">
          {children}
        </main>
      </div>
    </div>
  );
}
