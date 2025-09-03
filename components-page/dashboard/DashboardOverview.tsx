'use client';

import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar
} from 'recharts';
import { Activity, AlertTriangle, Clock } from 'lucide-react';

// ---------------- GraphQL ----------------
// Vehicles: statuses
const Q_VEHICLE_STATUSES = gql`
  query VehicleStatuses {
    rescueVehicles {
      nodes {
        status
      }
    }
  }
`;

// Civilians: dynamic roles
const Q_CIVILIAN_ROLES = gql`
  query CivilianRoles {
    civilians {
      nodes {
        civilianStatus { role }
        civilianStatusId
      }
    }
  }
`;

// Requests: createdAt + status + category/subcategory (single query covers all needs)
const Q_REQUESTS_ALL = gql`
  query RequestsAll {
    rescueVehicleRequests {
      createdAt
      status
      emergencySubCategory {
        name
        emergencyCategory { name }
      }
    }
  }
`;

// ---------------- Utils ----------------
const TZ = 'Asia/Colombo';

// "YYYY-MM-DD" for any Date in the target timezone
function ymdInTZ(d: Date | string, tz = TZ) {
  const dt = typeof d === 'string' ? new Date(d) : d;
  const s = dt.toLocaleString('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
  // en-CA gives YYYY-MM-DD
  return s;
}

function lastNDaysTZ(n: number, tz = TZ) {
  const arr: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    arr.push(ymdInTZ(d, tz));
  }
  return arr;
}

function isTodayInTZ(iso: string, tz = TZ) {
  return ymdInTZ(iso, tz) === ymdInTZ(new Date(), tz);
}

// ---------------- Component ----------------
export default function DashboardOverview() {
  // Fetch
  const { data: vehData, loading: vehLoading, error: vehError } = useQuery(Q_VEHICLE_STATUSES, { fetchPolicy: 'cache-and-network' });
  const { data: civData, loading: civLoading, error: civError } = useQuery(Q_CIVILIAN_ROLES, { fetchPolicy: 'cache-and-network' });
  const { data: reqData, loading: reqLoading, error: reqError } = useQuery(Q_REQUESTS_ALL, { fetchPolicy: 'cache-and-network' });

  const vehicles = vehData?.rescueVehicles?.nodes ?? [];
  const civilians = civData?.civilians?.nodes ?? [];
  const requests = reqData?.rescueVehicleRequests ?? [];

  // ----- KPIs (Today) -----
  const TODAY = ymdInTZ(new Date(), TZ);
  const totalCasesToday = requests.filter((r: any) => isTodayInTZ(r.createdAt)).length;

  const doneSet = new Set(['completed', 'cancelled']);
  const unansweredSet = new Set(['searching', 'pending']); // adjust if your "unanswered" wording differs

  const ongoingToday = requests.filter((r: any) => {
    if (!isTodayInTZ(r.createdAt)) return false;
    const s = String(r.status || '').toLowerCase();
    return !doneSet.has(s);
  }).length;

  const unansweredToday = requests.filter((r: any) => {
    if (!isTodayInTZ(r.createdAt)) return false;
    const s = String(r.status || '').toLowerCase();
    return unansweredSet.has(s);
  }).length;

  // ----- Vehicles donut -----
  // Map statuses into Active / On Mission / Inactive
  let vActive = 0, vOnMission = 0, vInactive = 0;
  for (const v of vehicles as Array<{ status?: string }>) {
    const s = (v.status || '').toLowerCase();
    if (s === 'active') vActive++;
    else if (s.includes('mission') || s === 'busy' || s === 'assigned') vOnMission++;
    else vInactive++;
  }
  const vehicleRatio = [
    { name: 'Active', value: vActive },
    { name: 'On Mission', value: vOnMission },
    { name: 'Inactive', value: vInactive },
  ];

  // ----- Civilians donut (roles dynamic) -----
  const roleCounts = new Map<string, number>();
  for (const c of civilians as Array<{ civilianStatus?: { role?: string } | null }>) {
    const role = c.civilianStatus?.role || 'Unknown';
    roleCounts.set(role, (roleCounts.get(role) || 0) + 1);
  }
  const civRatio = Array.from(roleCounts.entries()).map(([name, value]) => ({ name, value }));

  // ----- Total cases line (last 14 days) -----
  const days = 14;
  const dayKeys = lastNDaysTZ(days, TZ);
  const byDay = Object.fromEntries(dayKeys.map(k => [k, 0]));
  for (const r of requests as Array<{ createdAt: string }>) {
    const key = ymdInTZ(r.createdAt, TZ);
    if (key in byDay) byDay[key] += 1;
  }
  const daySeries = dayKeys.map(k => ({ date: k, cases: byDay[k] || 0 }));

  // ----- Top emergencies → subcategory (top 10) -----
  const pairCounts = new Map<string, number>();
  for (const r of requests as Array<{ emergencySubCategory?: { name?: string, emergencyCategory?: { name?: string } } }>) {
    const sub = r.emergencySubCategory?.name || 'Unspecified';
    //const cat = r.emergencySubCategory?.emergencyCategory?.name || 'Unknown';
    const key = `${sub}`;
    pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
  }
  const topPairs = Array.from(pairCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  // ----- Colors -----
  const COLORS = ['#7327F5', '#F52765', '#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#e11d48', '#06b6d4', '#a3e635'];

  return (
    <div className="space-y-4 p-2 z-[10] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-400 hover:scrollbar-thumb-slate-500 dark:scrollbar-thumb-slate-600">
      {/* KPIs (Today) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700 rounded-2xl">
        <KpiCard title="Total Cases" value={totalCasesToday} icon={<Activity className="w-5 h-5" />} loading={reqLoading} error={!!reqError} />
        <KpiCard title="Ongoing Cases" value={ongoingToday} icon={<Clock className="w-5 h-5" />} loading={reqLoading} error={!!reqError} />
        <KpiCard title="Civilian Request" value={unansweredToday} icon={<AlertTriangle className="w-5 h-5" />} loading={reqLoading} error={!!reqError} />
      </div>

      {/* Row 1: Vehicles + Civilians */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Vehicles</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {vehLoading ? (
              <div className="text-sm text-slate-500">Loading…</div>
            ) : vehError ? (
              <div className="text-sm text-red-600">Failed to load vehicles.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={vehicleRatio} dataKey="value" nameKey="name" innerRadius={75} outerRadius={90} paddingAngle={2}>
                    {vehicleRatio.map((_, i) => <Cell key={`v-${i}`} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Civilians</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {civLoading ? (
              <div className="text-sm text-slate-500">Loading…</div>
            ) : civError ? (
              <div className="text-sm text-red-600">Failed to load civilians.</div>
            ) : civRatio.length === 0 ? (
              <div className="text-sm text-slate-500">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={civRatio} dataKey="value" nameKey="name" innerRadius={75} outerRadius={90}>
                    {civRatio.map((_, i) => <Cell key={`civ-${i}`} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Total cases (last 14 days) */}
      <Card>
        <CardHeader>
          <CardTitle>Total Cases (last {days} days)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {reqLoading ? (
            <div className="text-sm text-slate-500">Loading…</div>
          ) : reqError ? (
            <div className="text-sm text-red-600">Failed to load requests.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daySeries} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Row 3: Top emergencies → subcategory (bar, top 10) */}
      <Card>
        <CardHeader>
          <CardTitle>Top Emergencies</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          {reqLoading ? (
            <div className="text-sm text-slate-500">Loading…</div>
          ) : reqError ? (
            <div className="text-sm text-red-600">Failed to load requests.</div>
          ) : topPairs.length === 0 ? (
            <div className="text-sm text-slate-500">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPairs} layout="vertical" margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={90} />
                <Tooltip />
                <Bar dataKey="value" fill="#7D27F5" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------- UI Bits ----------------
function KpiCard({
  title, value, icon, loading, error,
}: { title: string; value: number; icon: React.ReactNode; loading?: boolean; error?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[14px] font-medium">{title}</CardTitle>
        <div className="text-slate-500">{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-slate-500 text-sm">Loading…</div>
        ) : error ? (
          <div className="text-red-600 text-sm">Failed to load</div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
