"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { AlertCircle, FileText, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { useState, useEffect } from "react";

const trendData = [
  { month: 'Jan', crimes: 400 },
  { month: 'Feb', crimes: 300 },
  { month: 'Mar', crimes: 550 },
  { month: 'Apr', crimes: 450 },
  { month: 'May', crimes: 600 },
  { month: 'Jun', crimes: 500 },
];

const typeData = [
  { name: 'Theft', value: 400 },
  { name: 'Burglary', value: 300 },
  { name: 'Assault', value: 300 },
  { name: 'Fraud', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardPage() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({
    total_firs: 10452,
    active_investigations: 1205,
    repeat_offenders: 450,
    crime_hotspots: 12,
    cases_closed: 8750
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="p-8 text-center text-gray-500 dark:text-slate-500">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t("Dashboard Overview")}</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Intelligence overview and real-time analytics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden relative group transition-colors">
          <div className="absolute inset-0 bg-blue-50 dark:bg-blue-500/5 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/10 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">{t("Total FIRs")}</CardTitle>
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_firs.toLocaleString()}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">+2.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden relative group transition-colors">
          <div className="absolute inset-0 bg-orange-50 dark:bg-orange-500/5 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/10 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">{t("Active Investigations")}</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.active_investigations.toLocaleString()}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">45 high priority</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden relative group transition-colors">
          <div className="absolute inset-0 bg-rose-50 dark:bg-rose-500/5 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/10 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">{t("Repeat Offenders")}</CardTitle>
            <Users className="h-4 w-4 text-rose-600 dark:text-rose-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.repeat_offenders.toLocaleString()}</div>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">+12 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden relative group transition-colors">
          <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-500/5 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/10 transition-colors"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">{t("Cases Closed")}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.cases_closed.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">84% clearance rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm dark:shadow-xl border-gray-200 dark:border-slate-800 bg-white dark:bg-[#020817] transition-colors">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-slate-200">Crime Volume Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCrimes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} className="dark:stroke-slate-500" />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} className="dark:stroke-slate-500" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--tw-prose-body)', borderColor: 'var(--tw-prose-hr)', color: 'var(--tw-prose-headings)' }} className="dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-100" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <Area type="monotone" dataKey="crimes" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCrimes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm dark:shadow-xl border-gray-200 dark:border-slate-800 bg-white dark:bg-[#020817] transition-colors">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-slate-200">Crime by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    stroke="none"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip className="dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-100" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
