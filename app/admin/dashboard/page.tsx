'use client';

import DashboardOverview from '@/components-page/dashboard/DashboardOverview';
import MapVehicles from '@/components-page/dashboard/MapVehicles';

export default function Page() {
  return (
    <div className="relative">
      <div className="h-[90vh]">
        <MapVehicles />
      </div>

      <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 p-3 z-50">
        <div className="relative h-full overflow-y-auto rounded-2xl
                        bg-white/70 dark:bg-slate-900/40
                        backdrop-blur-xl backdrop-saturate-150
                        border border-white/30 dark:border-white/10
                        shadow-2xl ring-1 ring-black/5">
            <div className="
                    pointer-events-none absolute inset-0 rounded-2xl
                    before:absolute before:inset-0 before:rounded-2xl
                    before:bg-gradient-to-br before:from-white/40 before:to-white/5
                    dark:before:from-white/10 dark:before:to-transparent
                    before:opacity-70
                    " />
          <DashboardOverview />
        </div>
      </div>
    </div>
  );
}
