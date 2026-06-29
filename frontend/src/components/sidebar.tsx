"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Network, 
  TrendingUp, 
  Map, 
  Users, 
  FileBarChart, 
  ShieldAlert, 
  Settings 
} from "lucide-react";
import { useTranslation } from "react-i18next";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500"
  },
  {
    label: "AI Copilot",
    icon: MessageSquare,
    href: "/copilot",
    color: "text-violet-500",
  },
  {
    label: "FIR Search",
    icon: FileText,
    href: "/fir",
    color: "text-pink-700",
  },
  {
    label: "Criminal Network",
    icon: Network,
    href: "/network",
    color: "text-orange-700",
  },
  {
    label: "Crime Trends",
    icon: TrendingUp,
    href: "/trends",
    color: "text-emerald-500",
  },
  {
    label: "Hotspot Analysis",
    icon: Map,
    href: "/hotspots",
    color: "text-green-700",
  },
  {
    label: "Offender Profiles",
    icon: Users,
    href: "/offenders",
    color: "text-blue-700",
  },
  {
    label: "Reports",
    icon: FileBarChart,
    href: "/reports",
    color: "text-gray-400",
  },
  {
    label: "Audit Logs",
    icon: ShieldAlert,
    href: "/audit",
    color: "text-red-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col bg-white dark:bg-transparent">
      <div className="flex h-16 items-center border-b border-gray-200 dark:border-slate-800 px-6 bg-gray-50/50 dark:bg-slate-900/50">
        <ShieldAlert className="h-6 w-6 text-indigo-600 dark:text-indigo-500" />
        <span className="ml-3 text-lg font-bold tracking-tight text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-indigo-400 dark:to-cyan-400">
          CrimeLens AI
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {routes.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-200 border border-transparent"
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-slate-500"}`} />
                {t(item.label)}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
      <div className="p-4 mt-auto border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            <span className="font-bold text-sm text-indigo-700 dark:text-indigo-400">IN</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 dark:text-slate-200 truncate">Investigator 1</p>
            <p className="text-xs text-gray-500 dark:text-slate-500 truncate">Active Session</p>
          </div>
        </div>
      </div>
    </div>
  );
};
