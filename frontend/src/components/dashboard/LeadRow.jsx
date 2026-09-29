import React, { useState } from 'react';
import PriorityBadge from './PriorityBadge';
import { ChevronRight, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeadRow = ({ lead }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <td className="py-4 pl-6 pr-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            {lead.customerName}
                            {lead.scoringSignals && lead.scoringSignals.length > 0 && (
                                isExpanded ? <ChevronDown className="w-3 h-3 text-slate-400 font-bold" /> : <ChevronRight className="w-3 h-3 text-slate-400 font-bold" />
                            )}
                        </span>
                        <span className="text-xs text-slate-500">Score: <span className="font-medium text-slate-700">{lead.leadScore ?? 'N/A'}</span></span>
                    </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
                    {lead.location}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="flex flex-col">
                        <span>{lead.propertyRequirement}</span>
                        <span className="text-xs text-slate-400 font-medium">Budget: {lead.budget}</span>
                    </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
                    {lead.timeline}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                        <PriorityBadge priority={lead.priority} />
                        {lead.urgency && (
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{lead.urgency} Urgency</span>
                        )}
                    </div>
                </td>
                <td className="px-4 py-4">
                    <div className="flex flex-col max-w-[200px]">
                        <span className="text-sm font-medium text-slate-800 truncate">{lead.recommendedAction || lead.recommendedNextAction || 'Awaiting analysis'}</span>
                        <span className="text-xs text-slate-500 truncate" title={lead.intent}>{lead.intent}</span>
                    </div>
                </td>
                <td className="py-4 pl-4 pr-6 whitespace-nowrap text-right">
                    <Link
                        to={`/leads/${lead.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium text-sm"
                    >
                        View
                    </Link>
                </td>
            </tr>

            {/* Expandable Signals Row */}
            {isExpanded && lead.scoringSignals && lead.scoringSignals.length > 0 && (
                <tr className="bg-indigo-50/30">
                    <td colSpan="7" className="px-6 py-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-indigo-100 p-1.5 rounded-md mt-0.5">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-indigo-800 mb-2">Why this priority?</p>
                                <div className="flex flex-wrap gap-2">
                                    {lead.scoringSignals.map((signal, idx) => (
                                        <span key={idx} className="bg-white border border-indigo-200 text-indigo-700 text-xs px-2.5 py-1 rounded-md shadow-sm">
                                            {signal}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default LeadRow;
