"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShieldAlert, Search, AlertOctagon, Info, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AuditPage() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-50043365852.development.catalystappsail.in';
        const res = await fetch(`${baseUrl}/api/audit`);
        if (res.ok) {
          const data = await res.json();
          if (data.error) {
            setError(data.error);
          } else {
            setLogs(data);
          }
        } else {
          setError("Failed to fetch audit logs.");
        }
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-red-500" />
          {t("System Audit Logs")}
        </h2>
        <p className="text-slate-400 mt-1">Immutable ledger of all system actions, queries, and security events.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Backend Error: </strong> {error}. 
          <em> Did you create the <code>AuditLog</code> table in the Catalyst Console yet?</em>
        </div>
      )}

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
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12 text-slate-500"><Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />Compiling secure audit trail from Catalyst...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-500">No logs found or table is empty.</td></tr>
                ) : logs.map((log, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      {log.status === "Success" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><CheckCircle2 className="h-3 w-3" /> Success</span>}
                      {log.status === "Warning" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20"><AlertOctagon className="h-3 w-3" /> Warning</span>}
                      {log.status === "Info" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20"><Info className="h-3 w-3" /> Info</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{log.user}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{log.ip}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-indigo-400">{log.action}</span>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{log.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-md truncate">
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
