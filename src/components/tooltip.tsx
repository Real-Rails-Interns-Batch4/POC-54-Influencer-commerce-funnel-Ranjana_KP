"use client";

import React, { useState } from "react";
import { HelpCircle, X } from "lucide-react";

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function Tooltip({ content, children, position = "top", delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2"
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} z-50 w-max max-w-xs bg-[#0B1117] border border-[#38BDF8] rounded-lg p-2.5 text-[11px] text-gray-200 font-mono pointer-events-none animate-in fade-in duration-150`}
          style={{
            boxShadow: "0 0 16px rgba(56, 189, 248, 0.1)"
          }}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-[#0B1117] border border-[#38BDF8] rotate-45 ${
            position === "top" ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" :
            position === "bottom" ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" :
            position === "left" ? "right-0 top-1/2 -translate-y-1/2 translate-x-1/2" :
            "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
          }`} />
        </div>
      )}
    </div>
  );
}

interface InfoIconProps {
  tooltip: string;
  className?: string;
}

export function InfoIcon({ tooltip, className = "" }: InfoIconProps) {
  return (
    <Tooltip content={tooltip} position="right">
      <HelpCircle className={`h-4 w-4 text-[#818CF8] cursor-help hover:text-[#38BDF8] transition-colors ${className}`} />
    </Tooltip>
  );
}

interface DataSourceBadgeProps {
  type: "live" | "synthetic" | "hybrid";
  timestamp?: string;
  className?: string;
}

export function DataSourceBadge({ type, timestamp, className = "" }: DataSourceBadgeProps) {
  const labels = {
    live: "Live Data",
    synthetic: "Synthetic Data",
    hybrid: "Hybrid Data"
  };

  const colors = {
    live: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    synthetic: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
    hybrid: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
  };

  const tooltips = {
    live: "Fetched live from World Bank API. Falls back to static benchmarks on timeout.",
    synthetic: "Deterministically generated using Mulberry32 PRNG (seed=42) for reproducibility.",
    hybrid: "Combines live macroeconomic data with synthetic commerce events."
  };

  return (
    <Tooltip content={tooltips[type]} position="bottom">
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md border text-[10px] font-mono font-bold tracking-tight ${colors[type]} ${className}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${type === "live" ? "bg-emerald-400 animate-pulse" : type === "synthetic" ? "bg-indigo-400" : "bg-cyan-400"}`} />
        <span>{labels[type]}</span>
        {timestamp && <span className="text-[9px] opacity-70">({timestamp})</span>}
      </div>
    </Tooltip>
  );
}

interface SourceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: Array<{
    name: string;
    type: string;
    metrics: string[];
    description?: string;
  }>;
}

export function SourceInfoModal({ isOpen, onClose, sources }: SourceInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#0B1117] border border-[#1F2937] rounded-lg max-w-2xl max-h-[80vh] overflow-auto p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-white">Data Source Attribution</h2>
            <p className="text-[11px] text-gray-400 mt-1">POC-54 Influencer Commerce Funnel v1.0.0</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {sources.map((source, idx) => (
            <div key={idx} className="bg-[#030712] border border-[#1F2937] rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-[#38BDF8]">{source.name}</h3>
                  <p className="text-[10px] text-gray-500">{source.type}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {source.metrics.map((metric, mIdx) => (
                  <span key={mIdx} className="px-2 py-1 bg-[#0B1117] rounded text-[10px] text-gray-300 font-mono border border-[#1F2937]">
                    {metric}
                  </span>
                ))}
              </div>
              {source.description && (
                <p className="text-[10px] text-gray-400 font-mono mt-2">{source.description}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#38BDF8] hover:bg-[#22d3ee] text-black font-bold py-2 rounded-lg text-sm transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
