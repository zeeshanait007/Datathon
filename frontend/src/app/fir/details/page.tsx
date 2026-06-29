"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Fingerprint, ShieldCheck, User, Users, Calendar, MapPin, Activity } from "lucide-react";
import { CrimeDNA } from "@/components/crime-dna";

function FIRWorkspaceContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchFirData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-50043365852.development.catalystappsail.in'}/api/fir/${id}`);
        if (response.ok) {
          const json = await response.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch FIR workspace data", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFirData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-indigo-400">
        <Loader2 className="h-10 w-10 animate-spin mb-4 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
        <p className="font-mono text-sm tracking-widest animate-pulse">DECRYPTING CASE FILES...</p>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-rose-400">
        <AlertTriangle className="h-10 w-10 mb-4" />
        <p className="font-mono text-sm tracking-widest">ERROR: DOSSIER NOT FOUND OR ACCESS DENIED.</p>
      </div>
    );
  }

  const { case: fir, accused, victims, timeline, similar_cases } = data;

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <div className="space-y-6 relative max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black tracking-tight text-white font-mono">
              {fir.CrimeNo}
            </h2>
            <Badge variant="outline" className={`${fir.CaseStatusID === 1 ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'} font-mono uppercase tracking-widest`}>
              {fir.CaseStatusID === 1 ? 'ACTIVE' : 'CLOSED'}
            </Badge>
          </div>
          <p className="text-slate-400 mt-1 font-mono text-xs uppercase tracking-wider flex items-center">
            <Calendar className="h-3 w-3 mr-1" /> Registered: {fir.CrimeRegisteredDate} • <MapPin className="h-3 w-3 ml-3 mr-1" /> PS ID: {fir.PoliceStationID}
          </p>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-3">
        
        {/* Left Column: AI Copilot & Analysis */}
        <div className="space-y-6 md:col-span-1">
          <motion.div variants={item}>
            <CrimeDNA firData={data} similarityScore={94} />
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-[#0f172a]/80 backdrop-blur-md border-indigo-500/20 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-widest text-cyan-400 font-mono flex items-center">
                  <Activity className="h-4 w-4 mr-2" /> AI Investigation Copilot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Risk Assessment</h4>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className={`${(accused?.length || 0) > 0 ? 'bg-rose-500' : 'bg-orange-500'} h-2 rounded-full`} style={{ width: `${Math.min(((accused?.length || 0) * 20) + ((similar_cases?.length || 0) * 15) + 40, 98)}%` }}></div>
                  </div>
                  <p className={`text-xs ${(accused?.length || 0) > 0 ? 'text-rose-400' : 'text-orange-400'} font-mono mt-1`}>
                    {(accused?.length || 0) > 0 ? 'High Priority' : 'Elevated Priority'} (Priority Score: {Math.min(((accused?.length || 0) * 20) + ((similar_cases?.length || 0) * 15) + 40, 98)}/100)
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">AI Recommendations</h4>
                  <ul className="space-y-2">
                    <li className="text-xs text-slate-300 font-mono flex items-start gap-2 bg-indigo-500/10 p-2 rounded border border-indigo-500/20">
                      <ShieldCheck className="h-3 w-3 text-indigo-400 mt-0.5 shrink-0" />
                      {similar_cases && similar_cases.length > 0 
                        ? `Cross-reference MO with matching FIR ${similar_cases[0]}`
                        : `Initiate sector-wide scan for similar MO patterns`}
                    </li>
                    <li className="text-xs text-slate-300 font-mono flex items-start gap-2 bg-orange-500/10 p-2 rounded border border-orange-500/20">
                      <AlertTriangle className="h-3 w-3 text-orange-400 mt-0.5 shrink-0" />
                      {(accused && accused.length > 0)
                        ? `Deploy surveillance unit for suspect ${accused[0].AccusedName}`
                        : `CCTV footage acquisition pending from adjacent sectors`}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Entities & Timeline */}
        <div className="space-y-6 md:col-span-2">
          
          <motion.div variants={item} className="grid grid-cols-2 gap-4">
            <Card className="bg-[#0f172a]/80 backdrop-blur-md border-slate-800 shadow-xl">
              <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-mono flex items-center">
                  <User className="h-4 w-4 mr-2 text-rose-400" /> Suspect Profiles
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {accused && accused.length > 0 ? (
                  <div className="space-y-3">
                    {accused.map((a: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-slate-800/50">
                        <div>
                          <p className="text-sm text-white font-mono">{a.AccusedName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{a.PersonID} • Age: {a.AgeYear}</p>
                        </div>
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20 font-mono text-[10px]">MATCH</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-mono">No suspects identified in database.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#0f172a]/80 backdrop-blur-md border-slate-800 shadow-xl">
              <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-mono flex items-center">
                  <Users className="h-4 w-4 mr-2 text-emerald-400" /> Victim Profiles
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {victims && victims.length > 0 ? (
                  <div className="space-y-3">
                    {victims.map((v: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-slate-800/50">
                        <div>
                          <p className="text-sm text-white font-mono">{v.VictimName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Age: {v.AgeYear}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-mono">No victim data recorded.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-[#0f172a]/80 backdrop-blur-md border-slate-800 shadow-xl">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-xs uppercase tracking-widest text-indigo-400 font-mono flex items-center">
                  <Fingerprint className="h-4 w-4 mr-2" /> Investigation Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative border-l border-indigo-500/30 ml-3 space-y-6">
                  {/* Genesis Event */}
                  <div className="relative pl-6">
                    <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-[#0f172a]"></span>
                    <h3 className="text-sm font-mono text-white">FIR Registered</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">{fir.CrimeRegisteredDate}</p>
                  </div>
                  
                  {/* Arrest Events */}
                  {timeline && timeline.map((event: any, i: number) => (
                    <div key={i} className="relative pl-6">
                      <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-orange-500 ring-4 ring-[#0f172a]"></span>
                      <h3 className="text-sm font-mono text-white">Suspect Apprehended</h3>
                      <p className="text-xs text-slate-500 font-mono mt-1">{event.ArrestSurrenderDate} • PS ID: {event.PoliceStationID}</p>
                    </div>
                  ))}
                  
                  {/* Future/Pending */}
                  <div className="relative pl-6 opacity-50">
                    <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-slate-600 ring-4 ring-[#0f172a]"></span>
                    <h3 className="text-sm font-mono text-slate-300">Charge Sheet Submission</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">Pending Approval</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

export default function FIRWorkspacePage() {
  return (
    <Suspense fallback={<div className="h-[calc(100vh-8rem)] flex items-center justify-center text-indigo-400 font-mono tracking-widest animate-pulse">DECRYPTING...</div>}>
      <FIRWorkspaceContent />
    </Suspense>
  );
}
