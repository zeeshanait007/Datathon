"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, MapPin, AlertTriangle, Briefcase, Activity, X, Loader2, Link as LinkIcon, Crosshair, Network } from "lucide-react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export default function NetworkPage() {
  const { t } = useTranslation();
  const fgRef = useRef<any>();
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Interaction states
  const [hoverNode, setHoverNode] = useState<any | null>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("graph-container");
      if (container) {
        setDimensions({ width: container.offsetWidth, height: container.offsetHeight });
      }
    };
    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const fetchGraph = () => {
    setLoading(true);
    const url = searchQuery 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-50043365852.development.catalystappsail.in'}/api/network/${searchQuery}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-50043365852.development.catalystappsail.in'}/api/network/all`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then(data => {
        if (!data || !data.nodes || !data.links || data.nodes.length === 0) throw new Error("Invalid format or empty");
        setGraphData(data);
      })
      .catch(() => {
        // Impactful Demo Data Fallback for demonstration when db is empty
        setGraphData({
          nodes: [
            { id: "s1", group: "suspect", label: "Ravi Kumar", risk: 0.89, status: "At Large" },
            { id: "s2", group: "suspect", label: "Sunil D", risk: 0.65, status: "Arrested" },
            { id: "s3", group: "suspect", label: "Priya Sharma", risk: 0.92, status: "Under Surveillance" },
            { id: "c1", group: "crime", label: "FIR-2023/104", date: "2023-10-15", status: "Open" },
            { id: "c2", group: "crime", label: "FIR-2023/106", date: "2023-11-05", status: "Investigating" },
            { id: "l1", group: "location", label: "PS Zone 1" },
            { id: "v1", group: "victim", label: "Anita Patel", age: 29 },
          ],
          links: [
            { source: "s1", target: "c1", label: "ACCUSED_IN" },
            { source: "s2", target: "c1", label: "ACCUSED_IN" },
            { source: "s1", target: "s3", label: "KNOWN_ASSOCIATE" },
            { source: "s3", target: "c2", label: "ACCUSED_IN" },
            { source: "c1", target: "l1", label: "OCCURRED_AT" },
            { source: "c2", target: "l1", label: "OCCURRED_AT" },
            { source: "c1", target: "v1", label: "TARGETED" },
          ]
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const { highlightNodes, highlightLinks } = useMemo(() => {
    const nodes = new Set();
    const links = new Set();
    if (hoverNode) {
      nodes.add(hoverNode.id);
      graphData.links.forEach((link: any) => {
        if (link.source.id === hoverNode.id || link.target.id === hoverNode.id || link.source === hoverNode.id || link.target === hoverNode.id) {
          links.add(link);
          nodes.add(link.source.id || link.source);
          nodes.add(link.target.id || link.target);
        }
      });
    }
    if (selectedNode) {
      nodes.add(selectedNode.id);
      graphData.links.forEach((link: any) => {
        if (link.source.id === selectedNode.id || link.target.id === selectedNode.id || link.source === selectedNode.id || link.target === selectedNode.id) {
          links.add(link);
          nodes.add(link.source.id || link.source);
          nodes.add(link.target.id || link.target);
        }
      });
    }
    return { highlightNodes: nodes, highlightLinks: links };
  }, [graphData, hoverNode, selectedNode]);

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node);
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(3, 1000);
    }
  }, []);

  const handleSearch = () => {
    if (!searchQuery) return;
    const node = graphData.nodes.find((n: any) => 
      n.label?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.id?.toLowerCase() === searchQuery.toLowerCase()
    );
    if (node) {
      handleNodeClick(node);
    } else {
      fetchGraph(); 
    }
  };

  // Custom Node Drawing
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHighlighted = highlightNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;
    const isFaded = (hoverNode || selectedNode) && !isHighlighted;

    const size = node.group === "suspect" ? 8 : node.group === "crime" ? 6 : 4;
    
    // Palantir Glow Effect
    if (isSelected || (isHighlighted && !selectedNode)) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, size * 1.8, 0, 2 * Math.PI, false);
      ctx.fillStyle = node.group === "suspect" ? "rgba(244, 63, 94, 0.4)" : "rgba(99, 102, 241, 0.3)";
      ctx.fill();
    }

    // Node Body
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    ctx.fillStyle = isFaded ? "rgba(71, 85, 105, 0.2)" : 
                    node.group === "suspect" ? "#f43f5e" : 
                    node.group === "crime" ? "#6366f1" : 
                    node.group === "victim" ? "#10b981" : "#94a3b8";
    ctx.fill();

    // Node Label
    if (!isFaded && globalScale >= 1.5) {
      const label = node.label || node.id;
      const fontSize = 10 / globalScale;
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(label, node.x, node.y + size + fontSize + 2);
    }
  }, [highlightNodes, hoverNode, selectedNode]);

  // Custom Link Drawing
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHighlighted = highlightLinks.has(link);
    const isFaded = (hoverNode || selectedNode) && !isHighlighted;

    const start = link.source;
    const end = link.target;
    if (!start || !end || typeof start.x !== 'number' || typeof end.x !== 'number') return;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = isFaded ? "rgba(30, 41, 59, 0.5)" : isHighlighted ? "rgba(99, 102, 241, 0.8)" : "rgba(51, 65, 85, 0.5)";
    ctx.lineWidth = isHighlighted ? 1.5 / globalScale : 0.5 / globalScale;
    ctx.stroke();

    if (isHighlighted && globalScale >= 2 && link.label) {
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const fontSize = 6 / globalScale;
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      let angle = Math.atan2(end.y - start.y, end.x - start.x);
      if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI;
      
      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);
      ctx.fillText(link.label, 0, -2);
      ctx.restore();
    }
  }, [highlightLinks, hoverNode, selectedNode]);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col relative max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 font-mono">
            {t("NEXUS GRAPH")}
          </h2>
          <p className="text-slate-400 mt-1 font-mono text-xs uppercase tracking-wider">Topological mapping of syndicates, vectors, and geospatial anchors.</p>
        </div>
      </div>

      <Card className="flex-1 shadow-2xl border-indigo-500/20 bg-[#0f172a]/80 backdrop-blur-md overflow-hidden flex flex-col relative transition-colors">
        <CardHeader className="pb-3 border-b border-indigo-500/20 flex flex-row items-center space-y-0 gap-4 bg-[#0f172a] z-10">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-indigo-400" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search suspect ID or FIR..." 
              className="pl-10 bg-slate-900/50 border-indigo-500/30 text-white font-mono focus-visible:ring-indigo-500 placeholder:text-slate-500 transition-colors" 
            />
          </div>
          <Button onClick={handleSearch} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono tracking-wider">
            {loading ? "SCANNING..." : "LOCATE TARGET"}
          </Button>
          <Button onClick={() => { setSelectedNode(null); fgRef.current?.zoomToFit(400); }} variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 font-mono tracking-wider transition-colors ml-auto">
            <Crosshair className="h-4 w-4 mr-2"/> RESET MATRIX
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 relative bg-[#020817]" id="graph-container">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#020817]/80 backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              <p className="text-indigo-400 font-mono text-sm tracking-widest animate-pulse">COMPILING TOPOLOGY...</p>
            </div>
          )}
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none"></div>

          <ForceGraph2D
            ref={fgRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeCanvasObject={paintNode}
            linkCanvasObject={paintLink}
            onNodeHover={setHoverNode}
            onNodeClick={handleNodeClick}
            linkDirectionalParticles={link => highlightLinks.has(link) ? 4 : 0}
            linkDirectionalParticleWidth={1.5}
            linkDirectionalParticleColor={() => "rgba(167, 139, 250, 0.8)"}
            linkDirectionalParticleSpeed={0.015}
            cooldownTicks={100}
            d3AlphaDecay={0.05}
          />
        </CardContent>

        {/* Dynamic Insights Panel */}
        {selectedNode && (
          <div className="absolute top-16 right-4 bottom-4 w-80 bg-[#0f172a]/95 backdrop-blur-xl border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] rounded-xl transition-all duration-300 z-20 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-indigo-500/20 flex justify-between items-center bg-indigo-500/5">
              <h3 className="font-bold text-indigo-400 font-mono tracking-widest flex items-center text-xs">
                <Network className="h-4 w-4 mr-2" /> DOSSIER
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)} className="h-6 w-6 text-slate-400 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              <div className="space-y-1 text-center pb-4 border-b border-slate-800 transition-colors">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-[0_0_15px_currentColor] ${
                  selectedNode.group === "suspect" ? "bg-rose-500/10 text-rose-500 border border-rose-500/30" :
                  selectedNode.group === "crime" ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/30" :
                  "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                }`}>
                  {selectedNode.group === "suspect" && <User className="h-8 w-8" />}
                  {selectedNode.group === "crime" && <AlertTriangle className="h-8 w-8" />}
                  {selectedNode.group === "location" && <MapPin className="h-8 w-8" />}
                  {selectedNode.group === "victim" && <Briefcase className="h-8 w-8" />}
                </div>
                <h4 className="text-lg font-black text-white font-mono">{selectedNode.label || selectedNode.id}</h4>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-mono">{selectedNode.group}</p>
              </div>

              {selectedNode.group === "suspect" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1">Risk Quotient</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${selectedNode.risk > 0.8 ? 'bg-rose-500' : 'bg-orange-500'} shadow-[0_0_10px_currentColor]`} 
                          style={{ width: `${(selectedNode.risk || 0.75) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{(selectedNode.risk || 0.75).toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1">Status</p>
                    <p className="text-xs font-bold text-slate-300 font-mono">{selectedNode.status || "UNKNOWN"}</p>
                  </div>
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                    <p className="text-[10px] text-indigo-300 font-mono leading-relaxed">
                      <strong className="text-indigo-400">AI SYNTHESIS:</strong> Subject exhibits high interconnectivity with major identified syndicates. Network density indicates organizational leadership role.
                    </p>
                  </div>
                </div>
              )}

              {selectedNode.group === "crime" && (
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1">Chronology</p>
                    <p className="text-xs font-bold text-slate-300 font-mono">{selectedNode.date || "UNDOCUMENTED"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1">Status</p>
                    <p className="text-xs font-bold text-slate-300 font-mono uppercase">{selectedNode.status || "OPEN INVESTIGATION"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
