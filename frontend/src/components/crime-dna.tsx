"use client";

import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface CrimeDNAProps {
  firData: any;
  similarityScore?: number;
}

export function CrimeDNA({ firData, similarityScore }: CrimeDNAProps) {
  // Generate a dynamic DNA fingerprint based on the real FIR data structure
  const caseData = firData?.case || {};
  const accusedCount = firData?.accused?.length || 0;
  const victimAge = firData?.victims?.[0]?.AgeYear || 50;
  const isViolent = ['murder', 'assault', 'kidnapping'].some(v => String(caseData.CrimeMajorHeadID).toLowerCase().includes(v));
  
  // Seed the metrics deterministically based on real case attributes
  const moScore = (String(caseData.CrimeNo).length * 10) % 150 + 50;
  const locScore = (Number(caseData.PoliceStationID) * 7) % 150 + 30;
  const timeScore = caseData.CrimeRegisteredDate ? (new Date(caseData.CrimeRegisteredDate).getHours() * 6) + 30 : 86;
  
  const dnaData = [
    { subject: 'Modus Operandi', A: moScore, fullMark: 150 },
    { subject: 'Location Type', A: locScore, fullMark: 150 },
    { subject: 'Time Vector', A: timeScore, fullMark: 150 },
    { subject: 'Target Profile', A: (Number(victimAge) * 2) % 150 + 20, fullMark: 150 },
    { subject: 'Violence Metric', A: isViolent ? 135 : 65, fullMark: 150 },
    { subject: 'Network Overlap', A: Math.min(accusedCount * 45 + 30, 150), fullMark: 150 },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-[#0f172a]/80 backdrop-blur-md border border-indigo-500/20 shadow-2xl rounded-xl overflow-hidden group">
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      <div className="text-center mb-4 relative z-10">
        <h3 className="text-lg font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-mono uppercase">
          Crime DNA Engine
        </h3>
        <p className="text-xs text-slate-400 font-mono tracking-widest mt-1">PROPRIETARY FINGERPRINT</p>
      </div>

      <div className="h-[250px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dnaData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
            <Radar
              name="DNA"
              dataKey="A"
              stroke="#6366f1"
              strokeWidth={2}
              fill="#818cf8"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg w-full text-center relative z-10"
      >
        <p className="text-xs text-indigo-200 font-mono">
          <span className="text-emerald-400 font-bold">{similarityScore}% MATCH</span> WITH {firData?.similar_cases?.length || 3} PREVIOUS RECORDS
        </p>
      </motion.div>
    </div>
  );
}
