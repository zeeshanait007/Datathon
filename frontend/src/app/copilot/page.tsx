"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, ShieldCheck, Download, Mic, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  confidence?: number;
}

export default function CopilotPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello Investigator. I am your Crime Intelligence Copilot. How can I assist you with your investigation today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/copilot/chat`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ query: userMsg.content, history: messages })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        confidence: data.confidence_score
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to Intelligence API." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t("AI Copilot")}</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Natural language query interface for the intelligence database.</p>
        </div>
        <Button variant="outline" className="border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors">
          <Download className="h-4 w-4 mr-2" /> Export to PDF
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden shadow-sm dark:shadow-2xl border-gray-200 dark:border-slate-800 bg-white dark:bg-[#020817] transition-colors">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-500/30">
                  <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "user" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-200"}`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-300 dark:border-slate-700/50">
                    <p className="text-xs font-semibold flex items-center mb-2 text-gray-500 dark:text-slate-400">
                      <ShieldCheck className="h-3 w-3 mr-1 text-emerald-600 dark:text-emerald-400" /> Evidence Sources:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, idx) => (
                        <Badge key={idx} variant="outline" className="bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700 text-xs hover:bg-gray-100 dark:hover:bg-slate-700">{src}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {msg.confidence && (
                  <div className="mt-3 flex items-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 text-indigo-200 dark:text-indigo-300">
                      Confidence Score: {(msg.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-gray-300 dark:border-slate-700">
                  <User className="h-5 w-5 text-gray-600 dark:text-slate-400" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
               <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-500/30">
                  <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex gap-2 transition-colors">
          <Button variant="outline" size="icon" className="shrink-0 border-gray-300 dark:border-slate-700 text-gray-500 dark:text-slate-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-800"><Mic className="h-4 w-4" /></Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="E.g., Show burglary cases in Bangalore during last 6 months..."
            className="flex-1 bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus-visible:ring-indigo-500"
          />
          <Button onClick={handleSend} disabled={loading} className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20">
            <Send className="h-4 w-4 mr-2" /> Send
          </Button>
          <Button variant="outline" size="icon" className="shrink-0 border-gray-300 dark:border-slate-700 text-gray-500 dark:text-slate-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-800"><Volume2 className="h-4 w-4" /></Button>
        </CardFooter>
      </Card>
    </div>
  );
}
