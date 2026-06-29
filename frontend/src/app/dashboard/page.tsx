"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { FileText, CheckCircle2, TrendingUp, Loader2, ShieldAlert, Activity, Crosshair } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    total_firs: 0,
    active_investigations: 0,
    repeat_offenders: 0,
    crime_hotspots: 0,
    cases_closed: 0,
    typeData: [],
    trendData: []
  });

  useEffect(() => {
    setIsMounted(true);
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-50043365852.development.catalystappsail.in'}/api/dashboard`);
        if (response.ok) {
          const data = await response.json();
          setStats({
            total_firs: data.total_firs || 0,
            active_investigations: data.active_investigations || 0,
            repeat_offenders: data.repeat_offenders || 0,
            crime_hotspots: data.crime_hotspots || 0,
            cases_closed: data.cases_closed || 0,
            typeData: data.typeData || [],
            trendData: data.trendData || [],
            intel_feed: data.intel_feed || []
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (!isMounted) return null;

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 font-mono">
            {t("CENTRAL COMMAND")}
          </h2>
          <p className="text-slate-400 mt-1 flex items-center font-mono text-xs uppercase tracking-wider">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Telemetry • Authorized Personnel Only
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-indigo-400">
          <Loader2 className="h-10 w-10 animate-spin mb-4 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          <p className="font-mono text-sm tracking-widest animate-pulse">ESTABLISHING UPLINK...</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* KPI CARDS */}
          <motion.div variants={item} className="h-full">
            <Card className="bg-[#0f172a]/80 backdrop-blur-md border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)] overflow-hidden relative group h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-mono">Total FIRs</CardTitle>
                <FileText className="h-4 w-4 text-indigo-400" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-light text-white font-mono">{stats.total_firs.toLocaleString()}</div>
                <p className="text-xs text-indigo-400/80 mt-2 font-mono flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> +2.5% vs prior</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="h-full">
            <Card className="bg-[#0f172a]/80 backdrop-blur-md border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)] overflow-hidden relative group h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-mono">Active Investigations</CardTitle>
                <Activity className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-light text-white font-mono">{stats.active_investigations.toLocaleString()}</div>
                <p className="text-xs text-orange-400/80 mt-2 font-mono">Priority escalations active</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="h-full">
            <Card className="bg-[#0f172a]/80 backdrop-blur-md border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)] overflow-hidden relative group h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-mono">Repeat Offenders</CardTitle>
                <Crosshair className="h-4 w-4 text-rose-400" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-light text-white font-mono">{stats.repeat_offenders.toLocaleString()}</div>
                <p className="text-xs text-rose-400/80 mt-2 font-mono animate-pulse">High risk subjects detected</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="h-full">
            <Card className="bg-[#0f172a]/80 backdrop-blur-md border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] overflow-hidden relative group h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-mono">Clearance Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-light text-white font-mono">
                  {stats.total_firs > 0 ? Math.round((stats.cases_closed / stats.total_firs) * 100) : 0}%
                </div>
                <p className="text-xs text-emerald-400/80 mt-2 font-mono">{stats.cases_closed.toLocaleString()} cases closed</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* MAIN CHARTS AND ALERTS */}
          <motion.div variants={item} className="md:col-span-2 lg:col-span-3">
            <Card className="bg-[#0f172a]/80 backdrop-blur-md border-indigo-500/20 shadow-2xl h-[400px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-sm font-mono text-indigo-400 uppercase tracking-widest">Temporal Crime Velocity</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#475569" tick={{fill: '#64748b', fontSize: 12, fontFamily: 'monospace'}} />
                    <YAxis stroke="#475569" tick={{fill: '#64748b', fontSize: 12, fontFamily: 'monospace'}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#fff', borderRadius: '8px', fontFamily: 'monospace' }} 
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <Area type="monotone" dataKey="crimes" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorVelocity)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI INSIGHTS FEED */}
          <motion.div variants={item} className="md:col-span-2 lg:col-span-1">
            <Card className="bg-[#0f172a]/80 backdrop-blur-md border-indigo-500/20 shadow-2xl h-[400px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <CardHeader>
                <CardTitle className="text-sm font-mono text-purple-400 uppercase tracking-widest flex items-center">
                  <ShieldAlert className="h-4 w-4 mr-2" /> Live Intel Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {stats.intel_feed?.length > 0 ? (
                  stats.intel_feed.map((item: any, i: number) => {
                    const styles: Record<string, any> = {
                      high: { bg: "bg-rose-500/10", border: "border-rose-500/20", bar: "bg-rose-500", text: "text-rose-400" },
                      warn: { bg: "bg-orange-500/10", border: "border-orange-500/20", bar: "bg-orange-500", text: "text-orange-400" },
                      info: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", bar: "bg-indigo-500", text: "text-indigo-400" }
                    };
                    const s = styles[item.severity] || styles.info;
                    return (
                      <div key={i} className={`p-3 ${s.bg} border ${s.border} rounded-md relative overflow-hidden group`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.bar}`}></div>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-xs font-mono font-bold ${s.text}`}>{item.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono leading-relaxed">{item.message}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-md relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                    <p className="text-xs text-indigo-300 font-mono">Connecting to Intelligence Grid...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
