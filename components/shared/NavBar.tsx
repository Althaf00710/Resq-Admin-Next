'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Worm, Menu, X, TriangleAlert, ShieldUser, Truck, Ambulance, BriefcaseMedical, Users, UserCheck, UserCog, Siren} from 'lucide-react';
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './gradient-flow.css';
import Image from 'next/image';

interface NavbarProps {
  collapsed?: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard size={20} />,
    description: 'View system metrics and reports',
    lottieUrl: 'https://lottie.host/0eaca8c3-8098-488a-9077-e188db875a29/5RdxvpEsQ2.json',
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




const Navbar: React.FC<NavbarProps> = ({ collapsed = false, onToggle }) => {
  const pathname = usePathname();

  return (
    <aside className="h-full p-3 flex flex-col justify-between animate-gradient text-white shadow-lg">
      <div>
        {/* Top: Image + Toggle */}
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <Image
              src="/App_Logo.png"        
              alt="App Logo"             
              width={100}               
              height={100}
              className='ml-2'
            />
          )}
          <button
            className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-300 hover:text-blue-700 cursor-pointer focus:outline-none"
            onClick={onToggle}
          >
            {collapsed ? <X size={20} className='ml-2'/> : <Menu size={20} />}
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
                    ? 'bg-gray-100/50 text-blue-700 dark:bg-blue-800 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
                } ${collapsed ? 'justify-center' : 'gap-3'}`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>

              {/* Tooltip shown only when collapsed */}
              {collapsed && (
                <div className="absolute left-full top-1/2 mt-2 -translate-y-1/2 ml-1 z-20 hidden group-hover:flex w-48 rounded-xl border border-gray-300 backdrop-blur-md bg-black/30 
                              dark:bg-neutral-800/70 shadow-xl p-1 transition-all">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <DotLottieReact 
                      autoplay
                      loop
                      src={item.lottieUrl}
                      style={{ height: 86, width: 144, marginBottom: 0, marginTop: 0 }}
                    />
                    <p className="text-sm m-0 font-semibold text-white dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-xs font-semibold text-shadow-gray-800 text-gray-200 dark:text-gray-100 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Navbar;
