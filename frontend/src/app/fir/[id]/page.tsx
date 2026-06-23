"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, User, ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function FIRDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/firs/${params.id}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => {
        // Fallback
        setData({
          fir: { fir_number: "FIR-2025-45123", crime_type: "Burglary", date: "2025-06-12", status: "Open", summary: "Incident involved unauthorized entry into a residential property during night hours. Valuables missing." },
          victims: [{ name: "Rajesh Kumar", age: 45, gender: "Male" }],
          accused: [{ name: "Unknown", age: null, gender: "Unknown" }],
          location: { address: "123 Main St, Indiranagar, Bangalore" }
        });
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Loading FIR details...</div>;
  if (!data || !data.fir) return <div className="p-8 text-center text-red-500">FIR not found.</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/fir">
          <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{data.fir.fir_number}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{data.fir.crime_type}</Badge>
            <Badge variant={data.fir.status === 'Closed' ? 'secondary' : 'destructive'}>{data.fir.status}</Badge>
            <span className="text-sm text-gray-500">{new Date(data.fir.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-blue-100 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-800">
                <Bot className="h-5 w-5 mr-2 text-blue-600" /> AI Case Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{data.fir.summary}</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><FileText className="h-5 w-5 mr-2 text-gray-500" /> Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Incident Date</h4>
                  <p>{new Date(data.fir.date).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Reported To</h4>
                  <p>{data.fir.police_station || "Central Station"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><MapPin className="h-5 w-5 mr-2 text-gray-500" /> Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{data.location?.address || "Location not recorded"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><User className="h-5 w-5 mr-2 text-red-500" /> Accused</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.accused?.length ? data.accused.map((a: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                  <div>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-gray-500">{a.age ? `${a.age} yrs, ` : ''}{a.gender}</p>
                  </div>
                  {a.risk_score && <Badge variant="destructive">High Risk</Badge>}
                </div>
              )) : <p className="text-sm text-gray-500">No accused recorded.</p>}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><User className="h-5 w-5 mr-2 text-blue-500" /> Victims</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.victims?.length ? data.victims.map((v: any, i: number) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg border">
                  <p className="font-medium">{v.name}</p>
                  <p className="text-xs text-gray-500">{v.age ? `${v.age} yrs, ` : ''}{v.gender}</p>
                </div>
              )) : <p className="text-sm text-gray-500">No victims recorded.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
