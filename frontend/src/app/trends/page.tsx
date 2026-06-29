"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, Clock, Users, Loader2, Target, Activity } from "lucide-react";
import { motion } from "framer-motion";

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#eab308'];

export default function TrendsPage() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [temporalData, setTemporalData] = useState<any[]>([]);
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [breakdownData, setBreakdownData] = useState<any[]>([]);
  const [peakTimeData, setPeakTimeData] = useState<any[]>([]);
  const [kpis, setKpis] = useState({ total: 0, cyberSpike: 0, resolutionRate: 0, peakWindow: "Unknown", peakPercent: 0, avgAge: 0, males: 0, females: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const fetchAnalytics = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-50043365852.development.catalystappsail.in';
        const response = await fetch(`${baseUrl}/api/trends`);
        if (response.ok) {
          const trendsData = await response.json();
          
          const tData = trendsData.trendData || [];
          setTemporalData(tData);
          setDistrictData(trendsData.districtData || []);
          setBreakdownData(trendsData.typeData || []);
          setPeakTimeData(trendsData.peakTimeData || []);
          
          let spike = 0;
          if (tData.length >= 2) {
             const current = tData[tData.length - 1].cyber || 0;
             const prev = tData[tData.length - 2].cyber || 0;
             if (prev > 0) spike = ((current - prev) / prev) * 100;
             else if (current > 0) spike = 100;
          }
          
          const total = trendsData.total_firs || 0;
          const closed = trendsData.cases_closed || 0;
          
          setKpis({
            total: total,
            resolutionRate: total > 0 ? (closed / total) * 100 : 0,
            cyberSpike: spike,
            peakWindow: trendsData.peak_window || "Unknown",
            peakPercent: trendsData.peak_percentage || 0,
            avgAge: trendsData.avg_suspect_age || 0,
            males: trendsData.male_suspects || 0,
            females: trendsData.female_suspects || 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch Catalyst analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (!isMounted) return null;

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <div className="space-y-6 relative max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 font-mono">
            {t("FORECAST & ANALYTICS")}
          </h2>
          <p className="text-slate-400 mt-1 flex items-center font-mono text-xs uppercase tracking-wider">
            Predictive modeling and historical trajectory analysis
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-indigo-400">
          <Loader2 className="h-10 w-10 animate-spin mb-4 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          <p className="font-mono text-sm tracking-widest animate-pulse">COMPILING ALGORITHMS...</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          
          {/* Top Forecast Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={item} className="h-full">
              <Card className="bg-[#0f172a]/80 backdrop-blur-md border-indigo-500/20 shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-mono">Cyber Crime Velocity</CardTitle>
                  {kpis.cyberSpike >= 0 ? <TrendingUp className="h-4 w-4 text-rose-400" /> : <TrendingDown className="h-4 w-4 text-emerald-400" />}
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-light text-white font-mono">{Math.abs(kpis.cyberSpike).toFixed(1)}%</div>
                  <p className={`text-xs mt-2 font-mono ${kpis.cyberSpike >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {kpis.cyberSpike >= 0 ? "Upward trajectory detected" : "Downward stabilization"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="h-full">
              <Card className="bg-[#0f172a]/80 backdrop-blur-md border-indigo-500/20 shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-mono">Temporal Vulnerability</CardTitle>
                  <Clock className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-light text-white font-mono">{kpis.peakWindow}</div>
                  <p className="text-xs mt-2 font-mono text-orange-400">
                    Accounts for {Math.round(kpis.peakPercent)}% of incident volume
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="h-full">
              <Card className="bg-[#0f172a]/80 backdrop-blur-md border-indigo-500/20 shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-mono">Suspect Demographic</CardTitle>
                  <Users className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-light text-white font-mono">{Math.round(kpis.avgAge)} <span className="text-xl">YRS</span></div>
                  <p className="text-xs mt-2 font-mono text-cyan-400">
                    {kpis.males}M / {kpis.females}F Ratio
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="h-full">
              <Card className="bg-[#0f172a]/80 backdrop-blur-md border-indigo-500/20 shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-mono">AI Threat Assessment</CardTitle>
                  <Target className="h-4 w-4 text-rose-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-light text-rose-500 font-mono">CRITICAL</div>
                  <p className="text-xs mt-2 font-mono text-slate-400">
                    Resource reallocation recommended to Zone 3.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Multi-Dimensional Trajectory */}
            <motion.div variants={item} className="h-full w-full">
              <Card className="bg-[#0f172a]/80 backdrop-blur-md border-indigo-500/20 shadow-2xl h-[400px] flex flex-col w-full">
                <CardHeader>
                  <CardTitle className="text-sm font-mono text-indigo-400 uppercase tracking-widest">Category Vectors</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={temporalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProperty" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorViolent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#475569" tick={{fill: '#64748b', fontSize: 10, fontFamily: 'monospace'}} />
                      <YAxis stroke="#475569" tick={{fill: '#64748b', fontSize: 10, fontFamily: 'monospace'}} />
                      <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#fff', borderRadius: '8px', fontFamily: 'monospace' }} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <Area type="monotone" dataKey="property" stackId="1" stroke="#10b981" fill="url(#colorProperty)" />
                      <Area type="monotone" dataKey="violent" stackId="1" stroke="#f43f5e" fill="url(#colorViolent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Geographical Density */}
            <motion.div variants={item} className="h-full w-full">
              <Card className="bg-[#0f172a]/80 backdrop-blur-md border-indigo-500/20 shadow-2xl h-[400px] flex flex-col w-full">
                <CardHeader>
                  <CardTitle className="text-sm font-mono text-indigo-400 uppercase tracking-widest">Geographical Density</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                      <XAxis type="number" stroke="#475569" tick={{fill: '#64748b', fontSize: 10, fontFamily: 'monospace'}} />
                      <YAxis type="category" dataKey="name" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace'}} width={100} />
                      <RechartsTooltip cursor={{fill: 'rgba(99, 102, 241, 0.1)'}} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#fff', borderRadius: '8px', fontFamily: 'monospace' }} />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
