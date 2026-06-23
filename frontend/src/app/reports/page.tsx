"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, Filter, Plus, Loader2 } from "lucide-react";

const initialReports = [
  { id: "REP-2023-110", name: "Monthly Crime Synopsis - Bangalore Urban", date: "2023-11-01", type: "PDF", size: "2.4 MB", status: "Generated" },
  { id: "REP-2023-109", name: "Cyber Fraud Intelligence Briefing", date: "2023-10-28", type: "PDF", size: "1.8 MB", status: "Generated" },
  { id: "REP-2023-108", name: "Q3 Narcotics Task Force Summary", date: "2023-10-15", type: "CSV", size: "850 KB", status: "Generated" },
  { id: "REP-2023-107", name: "Vehicle Theft Hotspot Export", date: "2023-10-10", type: "Excel", size: "3.1 MB", status: "Generated" },
];

export default function ReportsPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState(initialReports);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate an API call to generate a new intelligence report
    setTimeout(() => {
      const newId = `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const newReport = {
        id: newId,
        name: `Automated Threat Assessment - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString().split('T')[0],
        type: "PDF",
        size: "1.2 MB",
        status: "Generated"
      };
      setReports([newReport, ...reports]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleDownload = (report: any) => {
    // Generate a mock blob to simulate file download for Datathon presentation
    const blob = new Blob(
      [`--- CLASSIFIED INTELLIGENCE REPORT ---\n\nID: ${report.id}\nTitle: ${report.name}\nDate: ${report.date}\n\n[Datathon Mock Document Content]\nEnd of Report.`], 
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.id}_${report.name.replace(/\s+/g, '_')}.txt`; // Downloading as .txt since it's a blob
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{t("Intelligence Reports")}</h2>
          <p className="text-slate-400 mt-1">Generate, download, and manage classified investigative reports.</p>
        </div>
        <Button 
          onClick={handleGenerateReport} 
          disabled={isGenerating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 transition-all"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {isGenerating ? "Compiling Data..." : "Generate New Report"}
        </Button>
      </div>

      <Card className="flex-1 shadow-2xl border-slate-800 bg-[#020817]">
        <CardHeader className="border-b border-slate-800 flex flex-row justify-between items-center">
          <CardTitle className="text-slate-200 text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            Recent Documents
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Report ID</th>
                  <th className="px-6 py-4 font-medium">Document Name</th>
                  <th className="px-6 py-4 font-medium">Date Generated</th>
                  <th className="px-6 py-4 font-medium">Format</th>
                  <th className="px-6 py-4 font-medium">Size</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-indigo-400">{report.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-200">{report.name}</td>
                    <td className="px-6 py-4">{report.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.type === 'PDF' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                        report.type === 'CSV' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{report.size}</td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        onClick={() => handleDownload(report)}
                        variant="ghost" 
                        size="sm" 
                        className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
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
