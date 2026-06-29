"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Map, AlertTriangle, Crosshair, Clock, MapPin, Activity } from "lucide-react";
import dynamic from "next/dynamic";
const HotspotMap = dynamic(() => import("@/components/map"), { ssr: false });
import { motion } from "framer-motion";

export default function HotspotsPage() {
  const { t } = useTranslation();
  const [timeIndex, setTimeIndex] = useState([100]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <div className="space-y-6 relative max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 font-mono">
            {t("GEOSPATIAL HEATMAP")}
          </h2>
          <p className="text-slate-400 mt-1 flex items-center font-mono text-xs uppercase tracking-wider">
            Real-time sector density and trajectory forecasting
          </p>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-4 flex-1 min-h-0">
        
        {/* Main Map Area */}
        <motion.div variants={item} className="md:col-span-3 flex flex-col">
          <Card className="flex-1 shadow-2xl border-indigo-500/20 bg-[#0f172a]/80 backdrop-blur-md overflow-hidden flex flex-col relative group transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none z-0"></div>
            
            <CardHeader className="border-b border-indigo-500/20 bg-[#0f172a] z-10 flex flex-row items-center justify-between py-3">
              <CardTitle className="text-xs uppercase tracking-widest text-indigo-400 font-mono flex items-center">
                <Map className="h-4 w-4 mr-2" /> Sector Feed
              </CardTitle>
              <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-1.5 rounded-full border border-indigo-500/30">
                <Clock className="h-4 w-4 text-slate-400" />
                <Slider 
                  value={timeIndex} 
                  onValueChange={setTimeIndex} 
                  max={100} 
                  step={1} 
                  className="w-48"
                />
                <span className="text-xs font-mono text-white font-bold w-12 text-right">
                  {timeIndex[0] === 100 ? "LIVE" : `T-${100 - timeIndex[0]}H`}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative z-10">
               <div className="absolute top-4 left-4 z-20 pointer-events-none">
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-mono text-[10px] uppercase tracking-widest backdrop-blur-md flex items-center shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    GPS Uplink Active
                  </Badge>
               </div>
               {/* Map Container */}
               <div className="w-full h-full grayscale-[0.8] contrast-[1.2] opacity-90 saturate-150">
                  <HotspotMap />
               </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Side Intelligence Panel */}
        <motion.div variants={item} className="flex flex-col space-y-6">
          <Card className="shadow-2xl border-indigo-500/20 bg-[#0f172a]/80 backdrop-blur-md transition-colors flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b border-indigo-500/20 bg-[#0f172a]">
              <CardTitle className="text-xs uppercase tracking-widest text-rose-400 font-mono flex items-center">
                <Crosshair className="h-4 w-4 mr-2" /> Critical Zones
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg group hover:bg-rose-500/20 transition-colors cursor-pointer relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-sm text-white font-mono flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-rose-400" /> Sector 7G
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">+45% velocity variance</p>
                    </div>
                    <Badge className="bg-rose-500 text-white border-none font-mono text-[10px] shadow-[0_0_10px_rgba(244,63,94,0.5)]">LEVEL 5</Badge>
                  </div>
                </div>

                <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg group hover:bg-orange-500/20 transition-colors cursor-pointer relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-sm text-white font-mono flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-orange-400" /> Koramangala
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">+12% velocity variance</p>
                    </div>
                    <Badge className="bg-orange-500 text-white border-none font-mono text-[10px] shadow-[0_0_10px_rgba(249,115,22,0.5)]">LEVEL 4</Badge>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg group hover:bg-emerald-500/20 transition-colors cursor-pointer relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-sm text-white font-mono flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-emerald-400" /> Whitefield
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Stabilized</p>
                    </div>
                    <Badge className="bg-emerald-500 text-white border-none font-mono text-[10px] shadow-[0_0_10px_rgba(16,185,129,0.5)]">LEVEL 2</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-indigo-500/20 bg-[#0f172a]/80 backdrop-blur-md transition-colors h-48 flex flex-col overflow-hidden">
            <CardHeader className="border-b border-indigo-500/20 bg-[#0f172a] py-3">
              <CardTitle className="text-xs uppercase tracking-widest text-cyan-400 font-mono flex items-center">
                <Activity className="h-4 w-4 mr-2" /> Spatial AI Synthesis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
              <p className="text-xs text-cyan-300 font-mono leading-relaxed">
                Algorithm detects abnormal clustering in Sector 7G correlating with recent repeat offender releases. Deployment of tactical units recommended within 48-hour window.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
