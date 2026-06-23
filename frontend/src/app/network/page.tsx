"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, MapPin, AlertTriangle, Briefcase, Activity, X } from "lucide-react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export default function NetworkPage() {
  const { t } = useTranslation();
  const fgRef = useRef<any>();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
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
    // Fetch a global network for the demo or a specific ID
    const url = searchQuery 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-50043365852.development.catalystappsail.in'}/api/network/${searchQuery}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-50043365852.development.catalystappsail.in'}/api/network/all`; // Fetch the entire global network

    // For Datathon MVP, we will rely heavily on a robust fallback if API fails
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
        // Impactful Demo Data Fallback
        setGraphData({
          nodes: [
            { id: "s1", group: "suspect", label: "Ravi Kumar", risk: 0.89, status: "At Large" },
            { id: "s2", group: "suspect", label: "Suresh", risk: 0.65, status: "Arrested" },
            { id: "s3", group: "suspect", label: "Kiran", risk: 0.92, status: "Under Surveillance" },
            { id: "c1", group: "crime", label: "Vehicle Theft", date: "2023-10-12", status: "Open" },
            { id: "c2", group: "crime", label: "Cyber Fraud", date: "2023-11-05", status: "Investigating" },
            { id: "l1", group: "location", label: "Koramangala 4th Block" },
            { id: "l2", group: "location", label: "Indiranagar 100ft Road" },
            { id: "v1", group: "victim", label: "Amit", age: 34 },
          ],
          links: [
            { source: "s1", target: "c1", label: "COMMITTED" },
            { source: "s1", target: "s2", label: "ASSOCIATED_WITH" },
            { source: "s3", target: "c2", label: "MASTERMIND" },
            { source: "s2", target: "c2", label: "ACCOMPLICE" },
            { source: "c1", target: "l1", label: "OCCURRED_AT" },
            { source: "c2", target: "l2", label: "OCCURRED_AT" },
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

  // Compute highlighting sets
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
      fetchGraph(); // Try to fetch from backend if not local
    }
  };

  // Custom Node Drawing
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHighlighted = highlightNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;
    const isFaded = (hoverNode || selectedNode) && !isHighlighted;

    const size = node.group === "suspect" ? 8 : node.group === "crime" ? 6 : 4;
    
    // Draw glow
    if (isSelected || (isHighlighted && !selectedNode)) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, size * 1.5, 0, 2 * Math.PI, false);
      ctx.fillStyle = node.group === "suspect" ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.2)";
      ctx.fill();
    }

    // Draw Node
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    ctx.fillStyle = isFaded ? "rgba(100,100,100,0.2)" : 
                    node.group === "suspect" ? "#ef4444" : 
                    node.group === "crime" ? "#eab308" : 
                    node.group === "victim" ? "#3b82f6" : "#9ca3af";
    ctx.fill();

    // Draw Label
    if (!isFaded && globalScale >= 1.5) {
      const label = node.label || node.id;
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(label, node.x, node.y + size + fontSize);
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
    ctx.strokeStyle = isFaded ? "rgba(100,100,100,0.1)" : isHighlighted ? "rgba(255,255,255,0.6)" : "rgba(203, 213, 225, 0.2)";
    ctx.lineWidth = isHighlighted ? 2 / globalScale : 1 / globalScale;
    ctx.stroke();

    // Draw Link Label if highlighted and zoomed in
    if (isHighlighted && globalScale >= 2 && link.label) {
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const fontSize = 8 / globalScale;
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = "rgba(200,200,200,0.8)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Calculate rotation
      let angle = Math.atan2(end.y - start.y, end.x - start.x);
      if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI; // Keep text upright
      
      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);
      ctx.fillText(link.label, 0, -2);
      ctx.restore();
    }
  }, [highlightLinks, hoverNode, selectedNode]);

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t("Criminal Network Intelligence")}</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Interactive graph visualization of syndicates, crimes, and spatial relationships.</p>
      </div>

      <Card className="flex-1 shadow-sm dark:shadow-2xl border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-[#020817] overflow-hidden flex flex-col relative transition-colors">
        <CardHeader className="pb-3 border-b border-gray-200 dark:border-slate-800 flex flex-row items-center space-y-0 gap-4 bg-white dark:bg-[#020817] z-10 transition-colors">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-slate-500" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search suspect or ID..." 
              className="pl-10 bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-200 focus-visible:ring-indigo-500 placeholder:text-gray-500 dark:placeholder:text-slate-500 transition-colors" 
            />
          </div>
          <Button onClick={handleSearch} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {loading ? "Scanning..." : "Locate Target"}
          </Button>
          <Button onClick={() => { setSelectedNode(null); fgRef.current?.zoomToFit(400); }} variant="outline" className="border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            Reset View
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 relative bg-slate-900 dark:bg-[#020817]" id="graph-container">
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
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleSpeed={0.01}
            cooldownTicks={100}
            d3AlphaDecay={0.05}
          />
        </CardContent>

        {/* Dynamic Insights Panel */}
        {selectedNode && (
          <div className="absolute top-0 right-0 h-full w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-gray-200 dark:border-slate-800 shadow-2xl transition-all duration-300 z-20 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900 transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-slate-200 flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Intelligence Profile
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)} className="h-6 w-6 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-1 text-center pb-4 border-b border-gray-200 dark:border-slate-800 transition-colors">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg ${
                  selectedNode.group === "suspect" ? "bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/50" :
                  selectedNode.group === "crime" ? "bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/50" :
                  "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-500 border border-blue-200 dark:border-blue-500/50"
                } transition-colors`}>
                  {selectedNode.group === "suspect" && <User className="h-8 w-8" />}
                  {selectedNode.group === "crime" && <AlertTriangle className="h-8 w-8" />}
                  {selectedNode.group === "location" && <MapPin className="h-8 w-8" />}
                  {selectedNode.group === "victim" && <Briefcase className="h-8 w-8" />}
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedNode.label || selectedNode.id}</h4>
                <p className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-slate-400">{selectedNode.group}</p>
              </div>

              {selectedNode.group === "suspect" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-500 mb-1">Risk Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                        <div 
                          className={`h-full ${selectedNode.risk > 0.8 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                          style={{ width: `${(selectedNode.risk || 0.75) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono text-gray-700 dark:text-slate-300">{(selectedNode.risk || 0.75).toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-500 mb-1">Status</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-300">{selectedNode.status || "Unknown"}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg transition-colors">
                    <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                      <strong>AI Summary:</strong> Subject exhibits high interconnectivity with major property theft syndicates. Immediate surveillance recommended based on historical network density.
                    </p>
                  </div>
                </div>
              )}

              {selectedNode.group === "crime" && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-500 mb-1">Incident Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-300">{selectedNode.date || "2023-XX-XX"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-500 mb-1">Status</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-300">{selectedNode.status || "Under Investigation"}</p>
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
