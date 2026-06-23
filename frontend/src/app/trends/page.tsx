"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

// Mock data for the Datathon MVP
const temporalData = [
  { month: "Jan", violent: 45, property: 120, cyber: 30 },
  { month: "Feb", violent: 52, property: 110, cyber: 45 },
  { month: "Mar", violent: 48, property: 140, cyber: 60 },
  { month: "Apr", violent: 61, property: 105, cyber: 85 },
  { month: "May", violent: 55, property: 90,  cyber: 110 },
  { month: "Jun", violent: 40, property: 85,  cyber: 140 }, // Notice the cyber spike!
];

const districtData = [
  { district: "Bangalore Urban", total: 450 },
  { district: "Mysuru", total: 210 },
  { district: "Hubballi", total: 180 },
  { district: "Mangaluru", total: 150 },
  { district: "Bangalore Rural", total: 120 },
];

const breakdownData = [
  { name: "Cyber Fraud", value: 45 },
  { name: "Vehicle Theft", value: 35 },
  { name: "Assault", value: 15 },
  { name: "Narcotics", value: 5 },
];
const COLORS = ['#ec4899', '#eab308', '#ef4444', '#8b5cf6'];

export default function TrendsPage() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="p-8 text-center text-gray-500 dark:text-slate-500">Loading Analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t("Crime Trends & Analytics")}</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Identify emerging patterns and historical crime trajectories.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* KPI Cards */}
        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white shadow-sm dark:shadow-xl transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Incidents (YTD)</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,205</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">+12% from last quarter</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white shadow-sm dark:shadow-xl transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">Cybercrime Spike</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">466%</div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Rapid increase in digital fraud</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white shadow-sm dark:shadow-xl transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-slate-400">Resolution Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.8%</div>
            <p className="text-xs text-rose-600 dark:text-rose-500 mt-1">-5% drop due to case backlog</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Temporal Chart */}
      <Card className="bg-white dark:bg-[#020817] border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-slate-200">6-Month Temporal Trajectory</CardTitle>
          <CardDescription className="text-gray-500 dark:text-slate-500">Notice the massive inversion between property crime and cybercrime starting in May.</CardDescription>
        </CardHeader>
        <CardContent className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={temporalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViolent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProperty" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCyber" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94a3b8" className="dark:stroke-slate-500" />
              <YAxis stroke="#94a3b8" className="dark:stroke-slate-500" />
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:stroke-slate-800" />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--tw-prose-body)', borderColor: 'var(--tw-prose-hr)', color: 'var(--tw-prose-headings)' }}
                className="dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-100"
              />
              <Legend />
              <Area type="monotone" dataKey="violent" name="Violent Crime" stroke="#ef4444" fillOpacity={1} fill="url(#colorViolent)" />
              <Area type="monotone" dataKey="property" name="Property Crime" stroke="#eab308" fillOpacity={1} fill="url(#colorProperty)" />
              <Area type="monotone" dataKey="cyber" name="Cybercrime" stroke="#ec4899" fillOpacity={1} fill="url(#colorCyber)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* District Chart */}
        <Card className="bg-white dark:bg-[#020817] border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-slate-200">Hotspot Jurisdictions</CardTitle>
          </CardHeader>
          <CardContent className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} className="dark:stroke-slate-800" />
                <XAxis type="number" stroke="#94a3b8" className="dark:stroke-slate-500" />
                <YAxis dataKey="district" type="category" stroke="#94a3b8" width={100} className="dark:stroke-slate-500" />
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} className="dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-100" />
                <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Breakdown Chart */}
        <Card className="bg-white dark:bg-[#020817] border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-slate-200">Incident Classification</CardTitle>
          </CardHeader>
          <CardContent className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip className="dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-100" />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
