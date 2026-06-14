"use client";

import { useMemo, useState } from "react";
import { Hash, Info } from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";

interface Node {
  id: string;
  label: string;
  val: number;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

interface HashtagNetworkData {
  nodes: Node[];
  edges: Edge[];
}

interface HashtagNetworkProps {
  data: HashtagNetworkData;
  loading?: boolean;
}

export function HashtagNetwork({ data, loading = false }: HashtagNetworkProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<Edge | null>(null);

  const cx = 300;
  const cy = 250;
  const radius = 180;

  // Calculate node positions in a circle layout
  const positionedNodes = useMemo(() => {
    const nodes = data?.nodes || [];
    if (nodes.length === 0) return [];
    
    // Sort nodes by value to make the layout look balanced
    const sorted = [...nodes].sort((a, b) => b.val - a.val);

    return sorted.map((node, index) => {
      const angle = (2 * Math.PI * index) / sorted.length;
      return {
        ...node,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
  }, [data?.nodes]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, typeof positionedNodes[0]>();
    positionedNodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [positionedNodes]);

  const edges = data?.edges || [];

  // Determine if a node is connected to the hovered node
  const connectedNodeIds = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const set = new Set<string>([hoveredNode]);
    edges.forEach((edge) => {
      if (edge.source === hoveredNode) set.add(edge.target);
      if (edge.target === hoveredNode) set.add(edge.source);
    });
    return set;
  }, [hoveredNode, edges]);

  // Max weight and val for scaling sizes
  const maxWeight = useMemo(() => {
    if (edges.length === 0) return 1;
    return Math.max(...edges.map((e) => e.weight));
  }, [edges]);

  const maxVal = useMemo(() => {
    const nodes = data?.nodes || [];
    if (nodes.length === 0) return 1;
    return Math.max(...nodes.map((n) => n.val));
  }, [data?.nodes]);

  // Scale functions
  const getNodeRadius = (val: number) => {
    const minR = 8;
    const maxR = 22;
    if (maxVal === 0) return minR;
    return minR + (val / maxVal) * (maxR - minR);
  };

  const getEdgeWidth = (weight: number) => {
    const minW = 1.5;
    const maxW = 7;
    return minW + (weight / maxWeight) * (maxW - minW);
  };

  const getEdgeOpacity = (edge: Edge) => {
    if (hoveredNode) {
      if (edge.source === hoveredNode || edge.target === hoveredNode) {
        return 0.85;
      }
      return 0.08;
    }
    const minO = 0.15;
    const maxO = 0.6;
    return minO + (edge.weight / maxWeight) * (maxO - minO);
  };

  const getNodeOpacity = (nodeId: string) => {
    if (hoveredNode) {
      return connectedNodeIds.has(nodeId) ? 1.0 : 0.2;
    }
    return 1.0;
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/10 border border-purple-500/20">
              <Hash className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
                Hashtag Co-occurrence Network Graph
              </h3>
              <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>
                Jaringan relasi antar hashtag berdasarkan frekuensi penggunaan bersama dalam video yang sama
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
            <Info className="w-3.5 h-3.5 text-zinc-400" />
            Hover node untuk melihat relasi terhubung
          </div>
        </div>

        {loading ? (
          <div className="h-[520px] flex items-center justify-center text-xs font-bold" style={{ color: TOKENS.textMuted }}>
            Membangun graf jaringan hashtag...
          </div>
        ) : positionedNodes.length === 0 ? (
          <div className="h-[520px] flex items-center justify-center text-xs font-semibold text-center leading-relaxed" style={{ color: TOKENS.textMuted }}>
            Tidak ada relasi hashtag yang ditemukan.<br />
            Pastikan video Anda memiliki beberapa hashtag di dalamnya.
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* SVG Network Canvas */}
            <div className="relative bg-zinc-950 dark:bg-black/35 rounded-xl border border-zinc-200 dark:border-zinc-800/80 p-2 overflow-hidden flex-1 w-full flex justify-center">
              <svg
                viewBox="0 0 600 500"
                width="100%"
                height="100%"
                className="max-h-[500px]"
                style={{ overflow: "visible" }}
              >
                {/* 1. Draw Edges */}
                <g>
                  {edges.map((edge, index) => {
                    const sourceNode = nodeMap.get(edge.source);
                    const targetNode = nodeMap.get(edge.target);
                    if (!sourceNode || !targetNode) return null;

                    const isHovered = hoveredEdge === edge;

                    return (
                      <line
                        key={`edge-${index}`}
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={isHovered ? "#a855f7" : "rgba(168, 85, 247, 0.4)"}
                        strokeWidth={getEdgeWidth(edge.weight)}
                        strokeOpacity={getEdgeOpacity(edge)}
                        className="transition-all duration-200"
                        onMouseEnter={() => setHoveredEdge(edge)}
                        onMouseLeave={() => setHoveredEdge(null)}
                        style={{ cursor: "pointer" }}
                      />
                    );
                  })}
                </g>

                {/* 2. Draw Nodes */}
                <g>
                  {positionedNodes.map((node) => {
                    const radius = getNodeRadius(node.val);
                    const opacity = getNodeOpacity(node.id);
                    const isHovered = hoveredNode === node.id;

                    return (
                      <g
                        key={`node-${node.id}`}
                        transform={`translate(${node.x}, ${node.y})`}
                        opacity={opacity}
                        className="transition-all duration-200 cursor-pointer"
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        {/* Outer glow ring for hovered node */}
                        {isHovered && (
                          <circle
                            r={radius + 6}
                            fill="none"
                            stroke="#ec4899"
                            strokeWidth={2}
                            strokeOpacity={0.6}
                            className="animate-ping"
                          />
                        )}

                        {/* Node circle */}
                        <circle
                          r={radius}
                          fill={isHovered ? "#ec4899" : "#a855f7"}
                          stroke="#ffffff"
                          strokeWidth={2}
                          style={{
                            filter: isHovered ? "drop-shadow(0 0 8px #ec4899)" : "none",
                          }}
                        />

                        {/* Label */}
                        <text
                          y={-radius - 8}
                          textAnchor="middle"
                          fill={isHovered ? "#ec4899" : "#ffffff"}
                          fontSize={isHovered ? 12 : 10}
                          fontWeight={isHovered ? "black" : "bold"}
                          style={{
                            paintOrder: "stroke",
                            stroke: "#09090b",
                            strokeWidth: 3,
                            strokeLinejoin: "round",
                          }}
                        >
                          #{node.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Sidebar Inspector Card */}
            <div className="w-full lg:w-72 flex flex-col gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col gap-3">
                <h4 className="font-black text-xs uppercase tracking-wider text-zinc-500">
                  Jaringan Inspector
                </h4>
                
                {hoveredNode ? (
                  <div>
                    <span className="text-xs font-bold text-zinc-400">Hashtag Terpilih</span>
                    <h5 className="font-black text-base text-purple-600 mt-0.5">
                      #{hoveredNode}
                    </h5>
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Total Koneksi:</span>
                        <span className="font-extrabold text-zinc-700 dark:text-zinc-200">
                          {connectedNodeIds.size - 1} hashtag
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Popularitas (Val):</span>
                        <span className="font-extrabold text-zinc-700 dark:text-zinc-200">
                          {nodeMap.get(hoveredNode)?.val}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : hoveredEdge ? (
                  <div>
                    <span className="text-xs font-bold text-zinc-400">Relasi Terpilih</span>
                    <h5 className="font-black text-sm text-zinc-800 dark:text-zinc-200 mt-1 leading-snug">
                      #{hoveredEdge.source} & #{hoveredEdge.target}
                    </h5>
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Co-occurrences:</span>
                        <span className="font-extrabold text-purple-600">
                          {hoveredEdge.weight} video
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                    Arahkan kursor Anda ke bulatan hashtag (node) atau garis penghubung (edge) untuk melihat statistik korelasi detil.
                  </p>
                )}
              </div>

              {/* Legend Summary */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
                <h4 className="font-black text-xs uppercase tracking-wider text-zinc-500">
                  Informasi Graf
                </h4>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-500 inline-block border border-white"></span>
                    <span className="text-zinc-600 dark:text-zinc-400">Bulatan = Hashtag</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-1 bg-purple-400/50 inline-block"></span>
                    <span className="text-zinc-600 dark:text-zinc-400">Garis = Koneksi Penggunaan Bersama</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed mt-1">
                    Ketebalan garis menunjukkan seberapa sering kedua hashtag tersebut digunakan bersama dalam satu video TikTok. Ukuran bulatan mewakili kekuatan popularitas relatif dari hashtag tersebut.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
