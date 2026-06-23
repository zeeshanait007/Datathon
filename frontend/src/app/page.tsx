"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-[400px] shadow-sm dark:shadow-2xl border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl relative overflow-hidden group transition-colors">
        <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/5 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
        <CardHeader className="text-center pb-2 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 dark:opacity-30 transition-opacity"></div>
              <ShieldAlert className="h-16 w-16 text-indigo-600 dark:text-indigo-500 relative z-10 transition-colors" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Crime Copilot</CardTitle>
          <CardDescription className="text-indigo-700 dark:text-indigo-300 font-medium tracking-wide uppercase text-xs mt-2 transition-colors">Government-Grade Intelligence</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 mt-4">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Investigator ID</label>
              <Input 
                required 
                type="text" 
                placeholder="investigator1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 focus-visible:ring-indigo-500 h-11 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Secure Access Key</label>
              <Input 
                required 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 focus-visible:ring-indigo-500 h-11 transition-colors"
              />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md dark:shadow-indigo-900/20 h-11 transition-all" disabled={loading}>
              {loading ? "Authenticating..." : "Establish Secure Uplink"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center flex justify-center text-[10px] text-gray-500 dark:text-slate-500 relative z-10 pt-6 border-t border-gray-200 dark:border-slate-800/50 transition-colors">
          SECURE ACCESS ONLY. UNAUTHORIZED USE IS PROHIBITED.
        </CardFooter>
      </Card>
    </div>
  );
}
