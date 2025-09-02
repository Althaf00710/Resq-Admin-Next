'use client';

import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMobileToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileToggle }) => {
  return (
    <header className="h-12 px-4 flex items-center justify-between border-b border-gray-200 dark:border-neutral-700 bg-gradient-to-r from-gray-300 to-gray-100 shadow-sm">
      {/* Hamburger Menu (Mobile only) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileToggle}
          className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Admin</h1>
      </div>
    </header>
  );
};

export default Header;
