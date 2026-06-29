"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye } from "lucide-react";
import Link from "next/link";

interface FIR {
  id: number;
  fir_number: string;
  crime_type: string;
  date: string;
  status: string;
  district: string;
}

export default function FIRSearchPage() {
  const { t } = useTranslation();
  const [firs, setFirs] = useState<FIR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-50043365852.development.catalystappsail.in'}/api/firs?limit=15`)
      .then(res => res.json())
      .then(data => {
        setFirs(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback dummy data if backend is not running
        setFirs([
          { id: 1, fir_number: "FIR-2025-45123", crime_type: "Burglary", date: "2025-06-12", status: "Open", district: "Bangalore Urban" },
          { id: 2, fir_number: "FIR-2025-45124", crime_type: "Theft", date: "2025-06-11", status: "Under Investigation", district: "Mysuru" },
          { id: 3, fir_number: "FIR-2025-45125", crime_type: "Assault", date: "2025-06-10", status: "Closed", district: "Hubballi" },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t("FIR Search")}</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Advanced search and filtering for First Information Reports.</p>
        </div>
      </div>

      <Card className="shadow-sm dark:shadow-2xl border-gray-200 dark:border-slate-800 bg-white dark:bg-[#020817] transition-colors">
        <CardHeader className="pb-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 transition-colors">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Search Query</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-slate-500" />
                <Input placeholder="Search by FIR Number, Accused Name..." className="pl-10 bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus-visible:ring-indigo-500 transition-colors" />
              </div>
            </div>
            <div className="w-full md:w-48 space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Crime Type</label>
              <Select>
                <SelectTrigger className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 focus:ring-indigo-500 transition-colors"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-200">
                  <SelectItem value="theft" className="focus:bg-gray-100 dark:focus:bg-slate-800 dark:focus:text-white">Theft</SelectItem>
                  <SelectItem value="burglary" className="focus:bg-gray-100 dark:focus:bg-slate-800 dark:focus:text-white">Burglary</SelectItem>
                  <SelectItem value="assault" className="focus:bg-gray-100 dark:focus:bg-slate-800 dark:focus:text-white">Assault</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48 space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">District</label>
              <Select>
                <SelectTrigger className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 focus:ring-indigo-500 transition-colors"><SelectValue placeholder="All Districts" /></SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-200">
                  <SelectItem value="blr" className="focus:bg-gray-100 dark:focus:bg-slate-800 dark:focus:text-white">Bangalore Urban</SelectItem>
                  <SelectItem value="mys" className="focus:bg-gray-100 dark:focus:bg-slate-800 dark:focus:text-white">Mysuru</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto shadow-md dark:shadow-indigo-900/20">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 transition-colors">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-gray-500 dark:text-slate-400 font-medium">FIR Number</TableHead>
                <TableHead className="text-gray-500 dark:text-slate-400 font-medium">Date</TableHead>
                <TableHead className="text-gray-500 dark:text-slate-400 font-medium">Crime Type</TableHead>
                <TableHead className="text-gray-500 dark:text-slate-400 font-medium">District</TableHead>
                <TableHead className="text-gray-500 dark:text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-right text-gray-500 dark:text-slate-400 font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-slate-800/50">
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-slate-500">Loading intelligence data...</TableCell></TableRow>
              ) : firs.map((fir) => (
                <TableRow key={fir.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/20 border-gray-200 dark:border-slate-800/50 transition-colors">
                  <TableCell className="font-mono font-medium text-indigo-600 dark:text-indigo-400">{fir.fir_number}</TableCell>
                  <TableCell className="text-gray-600 dark:text-slate-300">{new Date(fir.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-gray-600 dark:text-slate-300">{fir.crime_type}</TableCell>
                  <TableCell className="text-gray-600 dark:text-slate-300">{fir.district}</TableCell>
                  <TableCell>
                    <Badge className={`${
                      fir.status === 'Closed' ? 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' : 
                      (fir.status === 'Open' ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20')
                    } border font-medium`}>
                      {fir.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/fir/details?id=${fir.id}`}>
                      <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
