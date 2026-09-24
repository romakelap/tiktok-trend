import { useMemo, useState } from "react";
import { Info, Share2 } from "lucide-react";

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
    const maxW = 6;
    return minW + (weight / maxWeight) * (maxW - minW);
  };

  const getEdgeOpacity = (edge: Edge) => {
    if (hoveredNode) {
      if (edge.source === hoveredNode || edge.target === hoveredNode) {
        return 0.9;
      }
      return 0.06;
    }
    const minO = 0.15;
    const maxO = 0.65;
    return minO + (edge.weight / maxWeight) * (maxO - minO);
  };

  const getNodeOpacity = (nodeId: string) => {
    if (hoveredNode) {
      return connectedNodeIds.has(nodeId) ? 1.0 : 0.2;
    }
    return 1.0;
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-stone-900 dark:text-white">
                Hashtag Co-occurrence Network
              </h3>
              <p className="text-xs text-stone-500 dark:text-neutral-400">
                Peta visual relasi penggunaan bersama antar hashtag dalam satu video
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-neutral-400 bg-stone-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl border border-stone-200/60 dark:border-neutral-700">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            Hover node / relasi untuk melihat metrik
          </div>
        </div>

        {loading ? (
          <div className="h-[480px] flex flex-col items-center justify-center gap-2 text-xs font-bold text-stone-400 dark:text-neutral-500">
            <div className="w-6 h-6 rounded-full border-2 border-stone-900 dark:border-white border-t-transparent animate-spin" />
            <span>Membangun graf jaringan relasi...</span>
          </div>
        ) : positionedNodes.length === 0 ? (
          <div className="h-[480px] flex flex-col items-center justify-center text-xs text-center text-stone-400 dark:text-neutral-500 p-8 rounded-xl bg-stone-50 dark:bg-neutral-850 border border-dashed border-stone-200 dark:border-neutral-800">
            <Share2 className="w-8 h-8 mb-2 opacity-40" />
            <p className="font-bold text-stone-600 dark:text-neutral-400">Tidak ada relasi hashtag yang ditemukan</p>
            <p className="mt-1">Pastikan video memiliki minimal dua hashtag di dalam caption.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* SVG Network Canvas */}
            <div className="relative bg-stone-900 dark:bg-black/50 rounded-2xl border border-stone-800 p-3 overflow-hidden flex-1 w-full flex justify-center shadow-inner">
              <svg
                viewBox="0 0 600 500"
                width="100%"
                height="100%"
                className="max-h-[480px]"
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
                        stroke={isHovered ? "#38bdf8" : "rgba(148, 163, 184, 0.45)"}
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
                        {/* Outer pulse ring for hovered node */}
                        {isHovered && (
                          <circle
                            r={radius + 6}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth={2}
                            strokeOpacity={0.8}
                            className="animate-ping"
                          />
                        )}

                        {/* Node circle */}
                        <circle
                          r={radius}
                          fill={isHovered ? "#38bdf8" : "#f8fafc"}
                          stroke={isHovered ? "#ffffff" : "#0f172a"}
                          strokeWidth={2}
                          style={{
                            filter: isHovered ? "drop-shadow(0 0 10px #38bdf8)" : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                          }}
                        />

                        {/* Label */}
                        <text
                          y={-radius - 7}
                          textAnchor="middle"
                          fill={isHovered ? "#38bdf8" : "#f1f5f9"}
                          fontSize={isHovered ? 12 : 10}
                          fontWeight={isHovered ? "800" : "600"}
                          style={{
                            paintOrder: "stroke",
                            stroke: "#0f172a",
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

            {/* Sidebar Inspector & Legend Card */}
            <div className="w-full lg:w-80 flex flex-col gap-3">
              <div className="p-4 rounded-xl border border-stone-200/80 dark:border-neutral-800 bg-stone-50 dark:bg-neutral-850 flex flex-col gap-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-neutral-500">
                  Node Inspector
                </h4>
                
                {hoveredNode ? (
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[10px] font-medium text-stone-400">Hashtag Terpilih</span>
                      <h5 className="font-mono font-bold text-base text-stone-900 dark:text-white truncate">
                        #{hoveredNode}
                      </h5>
                    </div>
                    <div className="space-y-1.5 pt-2 border-t border-stone-200/60 dark:border-neutral-750 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500 dark:text-neutral-400">Koneksi Hashtag:</span>
                        <span className="font-mono font-bold text-stone-900 dark:text-white">
                          {connectedNodeIds.size - 1} tag terhubung
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500 dark:text-neutral-400">Nilai Frekuensi (Val):</span>
                        <span className="font-mono font-bold text-stone-900 dark:text-white">
                          {nodeMap.get(hoveredNode)?.val}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : hoveredEdge ? (
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[10px] font-medium text-stone-400">Relasi Pasangan</span>
                      <h5 className="font-mono font-bold text-sm text-stone-900 dark:text-white truncate">
                        #{hoveredEdge.source} + #{hoveredEdge.target}
                      </h5>
                    </div>
                    <div className="pt-2 border-t border-stone-200/60 dark:border-neutral-750 text-xs flex justify-between items-center">
                      <span className="text-stone-500 dark:text-neutral-400">Co-occurrences:</span>
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                        {hoveredEdge.weight} video bersama
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 dark:text-neutral-400 leading-relaxed py-1">
                    Arahkan kursor ke node bulatan atau garis relasi untuk melihat data korelasi lengkap.
                  </p>
                )}
              </div>

              {/* Legend Information */}
              <div className="p-4 rounded-xl border border-stone-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-neutral-500">
                  Panduan Graf
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-stone-900 dark:bg-white inline-block border border-stone-300"></span>
                    <span className="text-stone-600 dark:text-neutral-300 font-medium">Bulatan: Entitas Hashtag</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-1 bg-sky-400 inline-block rounded"></span>
                    <span className="text-stone-600 dark:text-neutral-300 font-medium">Garis: Frekuensi Bersama</span>
                  </div>
                  <p className="text-[10px] text-stone-400 dark:text-neutral-500 leading-relaxed pt-1 border-t border-stone-100 dark:border-neutral-800">
                    Makin tebal garis, makin sering kedua hashtag dipasang bersamaan oleh kreator pada konten viral.
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
