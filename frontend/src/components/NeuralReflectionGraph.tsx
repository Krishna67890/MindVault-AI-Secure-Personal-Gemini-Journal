import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain,
  Sparkles,
  Zap,
  Activity,
  Calendar,
  Tag,
  Smile,
  RefreshCw,
  Eye,
  X,
  Share2,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { JournalEntry } from '../services/journalStore';

interface NeuralNode {
  id: string;
  label: string;
  type: 'hub' | 'entry' | 'tag' | 'mood';
  x: number;
  y: number;
  size: number;
  color: string;
  data?: any;
}

interface SynapseEdge {
  from: string;
  to: string;
  weight: number;
}

interface NeuralReflectionGraphProps {
  entries: JournalEntry[];
  onSyncComplete?: () => void;
  isSyncing?: boolean;
}

const MOOD_COLORS: Record<string, string> = {
  Happy: '#10B981', // Emerald
  Joyful: '#10B981',
  Productive: '#3B82F6', // Blue
  Reflective: '#6366F1', // Indigo
  Neutral: '#8B5CF6', // Purple
  Anxious: '#F59E0B', // Amber
  Sad: '#EC4899', // Pink
  Chatted: '#14B8A6', // Teal
};

export const NeuralReflectionGraph: React.FC<NeuralReflectionGraphProps> = ({
  entries,
  onSyncComplete,
  isSyncing = false
}) => {
  const [selectedNode, setSelectedNode] = useState<NeuralNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'entries' | 'tags' | 'moods'>('all');
  const [syncTimestamp, setSyncTimestamp] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    setSyncTimestamp(new Date().toLocaleTimeString());
  }, [entries, isSyncing]);

  // Construct dynamic neural nodes & synapse edges from journal entries
  const { nodes, edges, sentimentData } = useMemo(() => {
    const nodeList: NeuralNode[] = [];
    const edgeList: SynapseEdge[] = [];
    const width = 800;
    const height = 450;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Central Vault Hub Node
    nodeList.push({
      id: 'vault_core',
      label: 'MindVault Core',
      type: 'hub',
      x: centerX,
      y: centerY,
      size: 32,
      color: '#6366F1',
      data: { count: entries.length, description: 'Neural Mind Core & Reflection Repository' }
    });

    if (!entries || entries.length === 0) {
      // Demo fallback nodes when empty
      const demoEntries = [
        { id: 'demo1', title: 'MindVault Initialization', mood: 'Reflective', tags: ['mindset', 'clarity'], createdAt: new Date().toISOString() },
        { id: 'demo2', title: 'Daily Focus & Intentions', mood: 'Productive', tags: ['goals', 'growth'], createdAt: new Date().toISOString() },
        { id: 'demo3', title: 'Emotional Balance Milestone', mood: 'Happy', tags: ['mindfulness'], createdAt: new Date().toISOString() }
      ];

      demoEntries.forEach((entry, idx) => {
        const angle = (idx / demoEntries.length) * 2 * Math.PI;
        const radius = 140;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        nodeList.push({
          id: entry.id,
          label: entry.title,
          type: 'entry',
          x,
          y,
          size: 22,
          color: MOOD_COLORS[entry.mood] || '#6366F1',
          data: entry
        });

        edgeList.push({ from: 'vault_core', to: entry.id, weight: 2 });
      });

      return { nodes: nodeList, edges: edgeList, sentimentData: [50, 70, 85, 90] };
    }

    // Process actual reflection entries
    const displayEntries = entries.slice(0, 10);
    const tagMap = new Map<string, number>();
    const moodMap = new Map<string, number>();

    displayEntries.forEach((entry, i) => {
      const angle = (i / displayEntries.length) * 2 * Math.PI;
      const radius = 130 + (i % 2 === 0 ? 30 : -20);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const color = MOOD_COLORS[entry.mood] || '#8B5CF6';

      nodeList.push({
        id: entry.id,
        label: entry.title || 'Reflection Entry',
        type: 'entry',
        x,
        y,
        size: 20,
        color,
        data: entry
      });

      // Connect to Core Hub
      edgeList.push({ from: 'vault_core', to: entry.id, weight: 1.5 });

      // Track Moods & Tags
      if (entry.mood) {
        moodMap.set(entry.mood, (moodMap.get(entry.mood) || 0) + 1);
      }

      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach(tag => tagMap.set(tag, (tagMap.get(tag) || 0) + 1));
      }
    });

    // Add Top Tag Nodes
    let tagIdx = 0;
    tagMap.forEach((count, tag) => {
      if (tagIdx < 5) {
        const angle = (tagIdx / Math.min(tagMap.size, 5)) * 2 * Math.PI + Math.PI / 4;
        const radius = 210;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const tagId = `tag_${tag}`;
        nodeList.push({
          id: tagId,
          label: `#${tag}`,
          type: 'tag',
          x,
          y,
          size: 16,
          color: '#EC4899',
          data: { tag, count }
        });

        // Connect tag to entries containing this tag
        displayEntries.forEach(entry => {
          if (entry.tags?.includes(tag)) {
            edgeList.push({ from: entry.id, to: tagId, weight: 1 });
          }
        });
        tagIdx++;
      }
    });

    // Calculate sentiment timeline score
    const scores = displayEntries.map(e => {
      switch (e.mood) {
        case 'Happy': case 'Joyful': return 95;
        case 'Productive': return 88;
        case 'Reflective': return 82;
        case 'Neutral': case 'Chatted': return 75;
        case 'Anxious': return 60;
        case 'Sad': return 50;
        default: return 78;
      }
    }).reverse();

    return { nodes: nodeList, edges: edgeList, sentimentData: scores.length > 0 ? scores : [70, 80, 85, 92] };
  }, [entries]);

  const filteredNodes = useMemo(() => {
    if (activeFilter === 'all') return nodes;
    return nodes.filter(n => n.type === activeFilter || n.type === 'hub');
  }, [nodes, activeFilter]);

  return (
    <div className="bg-slate-900/90 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden text-white space-y-8 group">
      {/* Background Neon Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none group-hover:bg-indigo-600/20 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <Brain size={14} className="animate-pulse text-indigo-400" /> Live Neural Graph
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            Reflection Neural Mesh
            {isSyncing && <RefreshCw size={22} className="animate-spin text-indigo-400" />}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Synchronized with <span className="text-indigo-400 font-bold">{entries.length} reflections</span> • Last Synced: {syncTimestamp}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          {(['all', 'entries', 'tags'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Graph Canvas */}
      <div className="relative w-full h-[400px] md:h-[480px] bg-slate-950/90 rounded-[2.5rem] border border-slate-800/80 overflow-hidden shadow-inner flex items-center justify-center">
        <svg className="w-full h-full cursor-grab active:cursor-grabbing" viewBox="0 0 800 450">
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.1" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Render Synapse Edge Lines */}
          {edges.map((edge, idx) => {
            const source = nodes.find(n => n.id === edge.from);
            const target = nodes.find(n => n.id === edge.to);
            if (!source || !target) return null;

            const isSelected = selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id);

            return (
              <line
                key={idx}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={isSelected ? '#818CF8' : '#334155'}
                strokeWidth={isSelected ? 2.5 : edge.weight}
                strokeDasharray={isSelected ? '5,5' : 'none'}
                opacity={isSelected ? 1 : 0.4}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Render Neural Nodes */}
          {filteredNodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            const isHub = node.type === 'hub';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group/node"
              >
                {/* Outer Glow Halo */}
                <circle
                  r={node.size + (isHub ? 12 : 6)}
                  fill={node.color}
                  opacity={isHub ? 0.25 : 0.15}
                  className="animate-ping duration-1000"
                />

                {/* Node Circle */}
                <circle
                  r={node.size}
                  fill={isHub ? 'url(#hubGlow)' : node.color}
                  stroke={isSelected ? '#FFFFFF' : '#1E293B'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  filter="url(#glow)"
                  className="transition-all duration-300 group-hover/node:scale-125"
                />

                {/* Node Text Label */}
                <text
                  y={node.size + 16}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize={node.type === 'hub' ? 12 : 10}
                  fontWeight={node.type === 'hub' ? '800' : '600'}
                  className="pointer-events-none tracking-wider font-sans select-none"
                >
                  {node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Floating Modal */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 p-6 rounded-3xl shadow-2xl space-y-4 animate-in slide-in-from-bottom-4 duration-300 z-20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                {selectedNode.type} Node
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h4 className="text-lg font-black text-white">{selectedNode.label}</h4>
              {selectedNode.data?.createdAt && (
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Reflected on: {new Date(selectedNode.data.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {selectedNode.data?.content && (
              <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 max-h-24 overflow-y-auto">
                "{selectedNode.data.content}"
              </p>
            )}

            {selectedNode.data?.mood && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emotional State:</span>
                <span
                  className="text-xs font-black px-2.5 py-0.5 rounded-lg text-slate-950"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  {selectedNode.data.mood}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Emotional Sentiment Timeline Trend Curve */}
      <div className="bg-slate-950/60 backdrop-blur-md rounded-[2.5rem] p-6 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-emerald-400" />
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Reflection Sentiment Trajectory</h4>
          </div>
          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
            Optimal Growth
          </span>
        </div>

        {/* Mini SVG Trend Line */}
        <div className="w-full h-20 relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path
              d={`M 0 ${40 - (sentimentData[0] || 60) * 0.3} Q 33 ${40 - (sentimentData[1] || 75) * 0.3}, 66 ${40 - (sentimentData[2] || 85) * 0.3} T 100 ${40 - (sentimentData[sentimentData.length - 1] || 90) * 0.3}`}
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NeuralReflectionGraph;
