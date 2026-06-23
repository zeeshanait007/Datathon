"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, User, History, ShieldAlert } from "lucide-react";

export default function OffendersPage() {
  const { t } = useTranslation();

  const offenders = [
    { id: 1, name: "Ravi Kumar", age: 34, gender: "Male", risk: 85, crimes: ["Theft", "Burglary"], lastActive: "2025-06-12", status: "Wanted" },
    { id: 2, name: "Suresh P.", age: 29, gender: "Male", risk: 65, crimes: ["Assault"], lastActive: "2025-04-20", status: "In Custody" },
    { id: 3, name: "Anita S.", age: 41, gender: "Female", risk: 40, crimes: ["Fraud"], lastActive: "2025-01-15", status: "On Parole" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t("Offender Profiles")}</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Risk assessment and behavioral profiling of known suspects.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offenders.map(offender => (
          <Card key={offender.id} className="shadow-sm dark:shadow-2xl border-gray-200 dark:border-slate-800 bg-white dark:bg-[#020817] relative overflow-hidden group transition-colors">
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 ${offender.risk > 70 ? 'bg-red-500' : 'bg-orange-500'}`}></div>
            <CardHeader className="pb-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 relative z-10 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center transition-colors">
                    <User className="h-6 w-6 text-gray-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-slate-200">{offender.name}</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-slate-500">{offender.age} yrs, {offender.gender}</p>
                  </div>
                </div>
                <Badge className={`${
                  offender.status === 'Wanted' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700'
                } border transition-colors`}>
                  {offender.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-5 relative z-10">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold flex items-center text-gray-700 dark:text-slate-300">
                    <AlertTriangle className={`h-4 w-4 mr-1.5 ${offender.risk > 70 ? 'text-rose-600 dark:text-rose-500' : 'text-orange-600 dark:text-orange-500'}`} />
                    Risk Score
                  </span>
                  <span className={`font-bold ${offender.risk > 70 ? 'text-rose-600 dark:text-rose-400' : 'text-orange-600 dark:text-orange-400'}`}>{offender.risk}/100</span>
                </div>
                <Progress value={offender.risk} className={`h-2 bg-gray-200 dark:bg-slate-800 ${offender.risk > 70 ? '[&>div]:bg-rose-500' : '[&>div]:bg-orange-500'} transition-colors`} />
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-slate-800 transition-colors">
                <p className="text-sm font-semibold flex items-center text-gray-500 dark:text-slate-400">
                  <History className="h-4 w-4 mr-2" /> Crime History
                </p>
                <div className="flex flex-wrap gap-2">
                  {offender.crimes.map((crime, idx) => (
                    <Badge key={idx} variant="outline" className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 transition-colors">{crime}</Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-between text-sm transition-colors">
                <span className="text-gray-500 dark:text-slate-500">Last Active</span>
                <span className="font-medium text-gray-700 dark:text-slate-300">{new Date(offender.lastActive).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
