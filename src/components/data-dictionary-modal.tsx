/**
 * Data Dictionary Modal Component
 * Displays all field definitions and entity information in a readable format
 */

"use client";

import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { DATA_DICTIONARY, getAllFieldsFlattened } from "@/lib/mock-data/data-dictionary";

interface DataDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataDictionaryModal({ isOpen, onClose }: DataDictionaryModalProps) {
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const allFields = getAllFieldsFlattened();
  const filteredFields = allFields.filter(
    field =>
      field.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const entities = DATA_DICTIONARY.filter(e =>
    searchTerm === "" || filteredFields.some(f => f.entity === e.entity)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B1117] border border-[#1F2937] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1F2937] bg-[#030712]">
          <div>
            <h2 className="text-2xl font-bold text-white">Data Dictionary</h2>
            <p className="text-sm text-gray-400 mt-1">
              Complete field definitions for the Influencer Commerce Funnel dataset
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1F2937] rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#1F2937]">
          <input
            type="text"
            placeholder="Search entities, fields, or descriptions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[#1F2937] border border-[#2A3F5F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 p-4">
            {entities.map((entity, idx) => (
              <div key={`entity-${idx}`} className="border border-[#1F2937] rounded-lg overflow-hidden">
                {/* Entity Header */}
                <button
                  onClick={() => setExpandedEntity(expandedEntity === entity.entity ? null : entity.entity)}
                  className="w-full px-4 py-3 bg-[#1F2937] hover:bg-[#2A3F5F] transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{entity.entity}</h3>
                    <p className="text-xs text-gray-400 mt-1">{entity.description}</p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      expandedEntity === entity.entity ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Entity Fields */}
                {expandedEntity === entity.entity && (
                  <div className="bg-[#0B1117] border-t border-[#1F2937] divide-y divide-[#1F2937]">
                    {entity.fields.map((field, fidx) => (
                      <div key={`field-${fidx}`}>
                        <button
                          onClick={() =>
                            setExpandedField(
                              expandedField === `${entity.entity}-${field.name}`
                                ? null
                                : `${entity.entity}-${field.name}`
                            )
                          }
                          className="w-full px-4 py-3 hover:bg-[#1F2937] transition-colors flex items-center justify-between text-left"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <code className="font-mono text-sm text-[#38BDF8]">{field.name}</code>
                              <span className="text-xs px-2 py-1 bg-[#1F2937] rounded text-gray-300">{field.type}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{field.description}</p>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                              expandedField === `${entity.entity}-${field.name}` ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Field Details */}
                        {expandedField === `${entity.entity}-${field.name}` && (
                          <div className="px-4 py-3 bg-[#030712] border-t border-[#1F2937] space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase">Business Meaning</p>
                              <p className="text-sm text-gray-300 mt-1">{field.businessMeaning}</p>
                            </div>

                            {field.format && (
                              <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase">Format</p>
                                <p className="text-sm text-gray-300 mt-1 font-mono">{field.format}</p>
                              </div>
                            )}

                            {field.validRange && (
                              <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase">Valid Range</p>
                                <p className="text-sm text-gray-300 mt-1">
                                  {field.validRange[0]} to {field.validRange[1]}
                                </p>
                              </div>
                            )}

                            {field.validValues && (
                              <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase">Valid Values</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {field.validValues.map((val, vi) => (
                                    <span
                                      key={vi}
                                      className="text-xs px-2 py-1 bg-[#1F2937] rounded text-[#38BDF8]"
                                    >
                                      {val}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase">Example Value</p>
                              <p className="text-sm text-gray-300 mt-1 font-mono">{field.example}</p>
                            </div>

                            {field.unit && (
                              <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase">Unit</p>
                                <p className="text-sm text-gray-300 mt-1">{field.unit}</p>
                              </div>
                            )}

                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase">Nullable</p>
                              <p className="text-sm text-gray-300 mt-1">{field.nullable ? "Yes" : "No"}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1F2937] bg-[#030712] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#030712] rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
