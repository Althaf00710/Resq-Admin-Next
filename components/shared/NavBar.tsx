'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Worm, Menu, X, TriangleAlert, ShieldUser, Truck,
  Ambulance, BriefcaseMedical, Users, UserCheck, UserCog, Siren, LogOut
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './gradient-flow.css';
import Image from 'next/image';

interface NavbarProps {
  collapsed?: boolean;
  onToggle: () => void;
  user?: { name?: string; username?: string; profilePicturePath?: string | null };
  onLogout?: () => void;
}
const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard size={20} />,
    description: 'View system metrics and reports',
    lottieUrl: 'https://lottie.host/02161c91-dd9c-408b-9349-79e2c12bdd4f/Sf6kab2lgx.json',
  },
  {
    label: 'Resq Cases',
    href: '/admin/resq-cases',
    icon: <Siren size={20} />,
    description: 'View Case Requests and Statuses',
    lottieUrl: 'https://lottie.host/80c50a62-30ec-4fcd-b0a3-4426daaffb03/HB7adHodiM.json',
  },
  {
    label: 'Snakes',
    href: '/admin/snakes',
    icon: <Worm size={20} />,
    description: 'Manage snake species records',
    lottieUrl: 'https://lottie.host/48f9eff0-29bd-4d2f-9a0e-cce0f666d00d/wvWMxBm4xj.json',
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: <UserCheck size={20} />,
    description: 'Manage user accounts and permissions',
    lottieUrl: 'https://lottie.host/a3cfd9e0-6b0e-4695-9123-c44be6a6f021/bDSF8z41C4.json',
  },
  {
    label: 'Emergency Categories',
    href: '/admin/emergency-category',
    icon: <TriangleAlert size={20} />,
    description: 'Manage Emergency Categories and Subs',
    lottieUrl: 'https://lottie.host/4cda0d3d-291c-47b2-861d-7941dbfe6035/P33k1D9V8l.json',
  },
  {
    label: 'Civilian Status',
    href: '/admin/civilian-status',
    icon: <ShieldUser size={20} />,
    description: 'Manage Civilian Status Accessibility',
    lottieUrl: 'https://lottie.host/bec69af3-bdc4-47bd-992a-1196a8034f39/Gt1mqwuvfQ.json',
  },
  {
    label: 'Vehicle Categories',
    href: '/admin/vehicle-category',
    icon: <Truck size={20} />,
    description: 'Manage Vehicle Category Accessibility',
    lottieUrl: 'https://lottie.host/472e51b4-a1b1-4411-bebf-b4aea80163d5/SDnJdTDHC7.json',
  },
  {
    label: 'ResQ Vehicles',
    href: '/admin/vehicles',
    icon: <Ambulance size={20} />,
    description: "Manage Rescue Vehicles' Records",
    lottieUrl: 'https://lottie.host/1f86b613-9fc5-4012-9a3f-7c3012fd237a/Tn0E5bLiHN.json',
  },
  {
    label: 'Civilians',
    href: '/admin/civilians',
    icon: <Users size={20} />,
    description: "Manage Rescue Vehicles' Records",
    lottieUrl: 'https://lottie.host/ae03c565-06ae-49d6-8366-cf9cdd1e7526/OrEW67Fnbr.json',
  },
  {
    label: 'Status Requests',
    href: '/admin/civilian-status-request',
    icon: <UserCog size={20} />,
    description: "Manage Civilian Status Requests",
    lottieUrl: 'https://lottie.host/40d61539-e905-42d3-a4ce-ff990104390d/78i89Km2Wl.json',
  },
  {
    label: 'First Aids',
    href: '/admin/firstaids',
    icon: <BriefcaseMedical size={20} />,
    description: "Manage First Aid Records for Emergencies",
    lottieUrl: 'https://lottie.host/36b16106-7361-498b-8793-f7ca03acaeff/tiRKwGcRSq.json',
  },
];


const DEFAULT_AVATAR_SRC = (() => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#6366f1"/>
          <stop offset="100%" stop-color="#a855f7"/>
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="40" fill="url(#g)"/>
      <circle cx="40" cy="30" r="14" fill="#fff" fill-opacity="0.95"/>
      <path d="M16 66c4-12 18-18 24-18s20 6 24 18" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.95"/>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
})();

/** Build an absolute image URL with NEXT_PUBLIC_SERVER_URL prefix when needed */
function buildAvatarSrc(path?: string | null) {
  if (!path) return DEFAULT_AVATAR_SRC;

  const trimmed = path.trim();
  // already absolute or data URL
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed;

  const base = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '');
  const rel = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  // if base is missing, just return the relative (still works for /public or same-origin)
  return base ? `${base}${rel}` : rel;
}

const Navbar: React.FC<NavbarProps> = ({ collapsed = false, onToggle, user, onLogout }) => {
  const pathname = usePathname();

  // Fallback to default avatar on load error
  const [avatarError, setAvatarError] = useState(false);
  const avatarSrc = useMemo(
    () => buildAvatarSrc(avatarError ? null : user?.profilePicturePath ?? null),
    [user?.profilePicturePath, avatarError]
  );

  return (
    <aside className="h-full p-3 flex flex-col justify-between bg-gradient-to-t from-violet-200 via-sky-200 to-blue-200 text-gray-600 shadow-lg z-[20]">
      <div>
        {/* Top: Image + Toggle */}
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <Image
              src="/App_Logo.png"
              alt="App Logo"
              width={100}
              height={100}
              className="ml-2"
              priority
            />
          )}
          <button
            className="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-white cursor-pointer focus:outline-none"
            onClick={onToggle}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <X size={20} className="ml-2" /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-0 relative">
          {navItems.map((item) => (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-md text-sm font-semibold transition ${
                  pathname === item.href
                    ? 'bg-gray-100/70 text-blue-900 dark:bg-blue-800 dark:text-white'
                    : 'text-gray-800/90 hover:bg-white/10'
                } ${collapsed ? 'justify-center' : 'gap-3'}`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full top-1/2 mt-2 -translate-y-1/2 ml-1 z-20 hidden group-hover:flex w-48 rounded-xl border border-white/20 backdrop-blur-md bg-black/30 shadow-xl p-1 transition-all">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <DotLottieReact autoplay loop src={item.lottieUrl} style={{ height: 86, width: 144 }} />
                    <p className="text-sm m-0 font-semibold text-white">{item.label}</p>
                    <p className="text-xs font-medium text-gray-100 leading-snug">{item.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User card + Logout */}
      <div className={`mt-4 ${collapsed ? 'px-1' : 'px-2'}`}>
        <div
          className={`rounded-xl border border-white/15 bg-white/10 backdrop-blur-md p-2 ${
            collapsed ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'
          }`}
        >
          {/* Avatar (next/image) */}
          <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20">
            <Image
              src={avatarSrc}
              alt={user?.name || 'Profile'}
              fill
              sizes="40px"
              className="object-cover rounded-full"
              onError={() => setAvatarError(true)}
              unoptimized
            />
          </div>

          {/* Name + username */}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name ?? 'Admin'}</p>
              <p className="text-xs text-gray-800/80 truncate">@{user?.username ?? 'unknown'}</p>
            </div>
          )}

          {/* Logout */}
          
        </div>
        {collapsed ? (
            <button
              onClick={onLogout}
              className="rounded-lg p-2 hover:bg-white/20 focus:outline-none"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onLogout}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          )}
      </div>
    </aside>
  );
};

export default Navbar;