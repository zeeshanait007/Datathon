"use client";

import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Bell, Search, User, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Header = () => {
  const { i18n, t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'kn' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex items-center p-4 h-16 bg-white/80 dark:bg-[#020817]/60 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 z-50 sticky top-0 transition-colors duration-300">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-slate-500" />
          <Input 
            placeholder={t("Search databases, FIRs, suspects...")} 
            className="w-full bg-gray-100 dark:bg-slate-900/50 text-gray-900 dark:text-slate-200 pl-10 border-gray-200 dark:border-slate-800 focus-visible:ring-1 focus-visible:ring-indigo-500 placeholder:text-gray-500 dark:placeholder:text-slate-500 transition-colors" 
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={toggleLanguage} size="sm" className="font-semibold border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors">
          {i18n.language === 'en' ? 'ಕನ್ನಡ' : 'English'}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
