"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Search, AlertOctagon, Info, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockAuditLogs = [
  { id: "LOG-9921", user: "investigator1", action: "Copilot Query", details: "Queried AI Copilot for 'Vehicle theft rings in Koramangala'", timestamp: "2023-11-15 14:32:01", status: "Success", ip: "192.168.1.45" },
  { id: "LOG-9920", user: "analyst_admin", action: "Network Expand", details: "Expanded network graph for Accused ID: s3", timestamp: "2023-11-15 13:15:44", status: "Success", ip: "10.0.0.12" },
  { id: "LOG-9919", user: "system", action: "Database Sync", details: "Automated sync with central Neo4j cluster", timestamp: "2023-11-15 12:00:00", status: "Success", ip: "localhost" },
  { id: "LOG-9918", user: "unknown", action: "Failed Login", details: "Invalid credentials attempted 3 times", timestamp: "2023-11-15 09:44:12", status: "Warning", ip: "45.22.19.102" },
  { id: "LOG-9917", user: "investigator2", action: "Export Data", details: "Exported CSV of top 100 FIRs", timestamp: "2023-11-14 16:20:55", status: "Success", ip: "192.168.1.88" },
  { id: "LOG-9916", user: "admin1", action: "Permission Change", details: "Elevated investigator1 to Level 2 access", timestamp: "2023-11-14 11:05:22", status: "Info", ip: "10.0.0.5" },
];

export default function AuditPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-red-500" />
          {t("System Audit Logs")}
        </h2>
        <p className="text-slate-400 mt-1">Immutable ledger of all system actions, queries, and security events.</p>
      </div>

      <Card className="flex-1 shadow-2xl border-slate-800 bg-[#020817]">
        <CardHeader className="border-b border-slate-800 flex flex-row items-center gap-4 bg-[#020817]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search logs by user, action, or IP..." 
              className="pl-10 bg-slate-900 border-slate-800 text-slate-200" 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">User / IP</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {mockAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono text-xs">{log.timestamp}</td>
                    <td className="px-6 py-4">
                      {log.status === "Success" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                      {log.status === "Warning" && <AlertOctagon className="h-5 w-5 text-red-500" />}
                      {log.status === "Info" && <Info className="h-5 w-5 text-blue-500" />}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{log.user}</div>
                      <div className="text-xs font-mono text-slate-500">{log.ip}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-md truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
