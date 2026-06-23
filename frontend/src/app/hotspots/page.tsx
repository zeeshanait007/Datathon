"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HotspotMap from "@/components/map";
import { Badge } from "@/components/ui/badge";

export default function HotspotsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t("Hotspot Analysis")}</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Geospatial crime distribution and density mapping.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-3 shadow-sm dark:shadow-2xl border-gray-200 dark:border-slate-800 bg-white dark:bg-[#020817] transition-colors">
          <CardHeader className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 transition-colors">
            <CardTitle className="text-gray-900 dark:text-slate-200">Crime Map</CardTitle>
          </CardHeader>
          <CardContent className="p-2 relative">
             <HotspotMap />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm dark:shadow-2xl border-gray-200 dark:border-slate-800 bg-white dark:bg-[#020817] transition-colors">
          <CardHeader className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 transition-colors">
            <CardTitle className="text-gray-900 dark:text-slate-200">Top Hotspots</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800/50 transition-colors">
                <span className="font-medium text-sm text-gray-700 dark:text-slate-300">Indiranagar</span>
                <Badge className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">Critical</Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800/50 transition-colors">
                <span className="font-medium text-sm text-gray-700 dark:text-slate-300">Koramangala</span>
                <Badge className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">Critical</Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800/50 transition-colors">
                <span className="font-medium text-sm text-gray-700 dark:text-slate-300">Majestic</span>
                <Badge className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">High</Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800/50 transition-colors">
                <span className="font-medium text-sm text-gray-700 dark:text-slate-300">Whitefield</span>
                <Badge className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">High</Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-none">
                <span className="font-medium text-sm text-gray-700 dark:text-slate-300">Jayanagar</span>
                <Badge className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">Medium</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
