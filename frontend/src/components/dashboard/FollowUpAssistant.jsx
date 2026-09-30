import React, { useState } from 'react';
import { Bot, Copy, Check, RefreshCw, CalendarCheck, AlertTriangle, MessageSquare, Clock, HelpCircle, CheckCircle2, Sparkles } from 'lucide-react';
import PriorityBadge from './PriorityBadge';

const FollowUpAssistant = ({ leadId, plan, currentStatus, error, onRefresh, onAnalyze }) => {
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState(currentStatus || 'Follow-up Needed'); // 'Follow-up Needed' | 'Follow-up Planned' | 'Contacted'
    const [generating, setGenerating] = useState(false);

    const toStr = (val, fallback) => {
        if (val === null || val === undefined) return fallback;
        if (typeof val === 'object') return fallback;
        return String(val) || fallback;
    };
    const toStrArray = (val) =>
        Array.isArray(val) ? val.map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item))) : [];

    const safePlan = {
        timing: toStr(plan?.timing, 'Pending'),
        channel: toStr(plan?.channel, 'Pending'),
        objective: toStr(plan?.objective, 'Pending Analysis'),
        talkingPoints: toStrArray(plan?.talkingPoints),
        suggestedMessage: toStr(plan?.suggestedMessage, typeof plan === 'string' ? plan : 'No message generated'),
        questionsToAsk: toStrArray(plan?.questionsToAsk),
        whatToAvoid: toStrArray(plan?.whatToAvoid),
        priority: toStr(plan?.priority, 'WARM'),
    };

    const handleCopy = () => {
        if (safePlan.suggestedMessage) {
            navigator.clipboard.writeText(safePlan.suggestedMessage);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRegenerate = async () => {
        setGenerating(true);
        try {
            await onRefresh();
        } finally {
            setGenerating(false);
        }
    };

    const handleMarkPlanned = () => {
        if (status === 'Follow-up Needed') {
            setStatus('Follow-up Planned');
        } else if (status === 'Follow-up Planned') {
            setStatus('Contacted');
        } else {
            setStatus('Follow-up Needed');
        }
    };

    if (!plan && !generating && !error) {
        return (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="bg-indigo-100 p-3 rounded-full mb-3">
                    <Bot className="w-5 h-5 text-indigo-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Generate AI Action Plan</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-4 mt-2">Transmute this analysis into a concrete next-step action plan explicitly dictating approach methodologies, targeted tracking queries, and draft emails.</p>
                <button onClick={handleRegenerate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4" /> Determine Next Steps
                </button>
            </div>
        );
    }

    if (generating) {
        return (
            <div className="bg-indigo-50/50 rounded-2xl p-12 border border-indigo-100 shadow-sm flex flex-col items-center justify-center text-center">
                <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mb-4" />
                <p className="font-medium text-indigo-800">Strategizing proactive follow-up constraints...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50/50 rounded-2xl p-8 border border-red-100 shadow-sm flex flex-col items-center justify-center text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-red-800">Generation Failed</h3>
                <p className="text-sm font-medium text-red-600 max-w-lg mt-2 mb-4">{error}</p>
                <button onClick={handleRegenerate} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col">
            {/* Sticky Header Action Block */}
            <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Bot className="w-5 h-5 text-indigo-600" />
                        AI Follow-Up Assistant
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className={`px-2 py-0.5 rounded-md border ${status === 'Contacted' ? 'bg-green-50 border-green-200 text-green-700' :
                            status === 'Follow-up Planned' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                'bg-amber-50 border-amber-200 text-amber-700'
                            }`}>
                            {status}
                        </span>
                        <span className="text-slate-300">•</span>
                        <PriorityBadge priority={safePlan.priority} />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handleRegenerate} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                        <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Regenerate</span>
                    </button>
                    <button onClick={handleMarkPlanned} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm font-medium">
                        {status === 'Contacted' ? <RefreshCw className="w-4 h-4" /> : <CalendarCheck className="w-4 h-4" />}
                        <span className="hidden sm:inline">
                            {status === 'Follow-up Needed' ? 'Mark Planned' : (status === 'Follow-up Planned' ? 'Mark Contacted' : 'Reset Status')}
                        </span>
                    </button>
                </div>
            </div>

            {/* Grid Layout Actions */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
                <div className="space-y-6">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Strategy Overview</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-indigo-50/50">
                                <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1"><Clock className="w-3.5 h-3.5" /> Timing</p>
                                <p className="text-slate-800 text-sm font-medium">{safePlan.timing}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-indigo-50/50">
                                <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1"><MessageSquare className="w-3.5 h-3.5" /> Channel</p>
                                <p className="text-slate-800 text-sm font-medium">{safePlan.channel}</p>
                            </div>
                        </div>
                        <div className="mt-4 bg-white rounded-lg p-3 shadow-sm border border-indigo-50/50">
                            <p className="text-xs font-semibold text-slate-500 mb-1">Primary Objective</p>
                            <p className="text-slate-800 text-sm font-medium">{safePlan.objective}</p>
                        </div>
                    </div>

                    <div>
                        <p className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3"><CheckCircle2 className="w-4 h-4 text-green-500" /> Talking Points</p>
                        <ul className="space-y-2">
                            {safePlan.talkingPoints.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <span className="text-green-500 font-bold mt-0.5">•</span> <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="flex items-center gap-2 text-sm font-bold text-slate-800"><MessageSquare className="w-4 h-4 text-blue-500" /> Suggested Message Draft</p>
                            <button onClick={handleCopy} className="text-xs flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded-md">
                                {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                            </button>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 font-serif leading-relaxed border border-slate-200 shadow-inner whitespace-pre-wrap">
                            {safePlan.suggestedMessage}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <p className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-3"><HelpCircle className="w-3.5 h-3.5" /> What to ask</p>
                            <ul className="space-y-1.5">
                                {safePlan.questionsToAsk.map((q, idx) => (
                                    <li key={idx} className="text-xs text-blue-900 border-b border-blue-100/50 pb-1.5 last:border-0 last:pb-0">{q}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
                            <p className="flex items-center gap-2 text-xs font-bold text-red-800 uppercase tracking-wider mb-3"><AlertTriangle className="w-3.5 h-3.5" /> What NOT to do</p>
                            <ul className="space-y-1.5">
                                {safePlan.whatToAvoid.map((rule, idx) => (
                                    <li key={idx} className="text-xs text-red-900 border-b border-red-100/50 pb-1.5 last:border-0 last:pb-0">{rule}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FollowUpAssistant;
