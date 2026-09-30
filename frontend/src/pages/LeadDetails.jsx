import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bot, MapPin, Loader2, AlertCircle, RefreshCw, Copy, Check, Clock, User, MessageSquare, Send, Calendar, Activity } from 'lucide-react';
import PriorityBadge from '../components/dashboard/PriorityBadge';
import FollowUpAssistant from '../components/dashboard/FollowUpAssistant';
import { apiClient } from '../utils/apiClient';

const LeadDetails = () => {
    const { id } = useParams();

    // High-Level Data State
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState(null);

    // AI Resolution State
    const [analyzing, setAnalyzing] = useState(false);
    const [analyzeError, setAnalyzeError] = useState(null);
    const [followUpError, setFollowUpError] = useState(null);
    const [copied, setCopied] = useState(false);

    // Chat AI State (Section 7)
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', content: "Hello! I'm your AI assistant. You can ask me anything about this lead's context, customer intent, or get suggestions for the next follow-up." }
    ]);
    const [chatMsg, setChatMsg] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestedQuestions = [
        "What should I emphasize?",
        "What is the biggest objection?",
        "Draft a WhatsApp reply",
        "What should I ask next?"
    ];

    /* --- API Methods --- */

    const fetchLead = async () => {
        try {
            const data = await apiClient.get(`/api/leads/${id}`);
            setLead(data);
        } catch (err) {
            setErrorText(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLead();
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isTyping]);

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setAnalyzeError(null);
        try {
            const data = await apiClient.post(`/api/leads/${id}/analyze`);
            setLead(data.lead);
        } catch (err) {
            setAnalyzeError(err.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleGenerateFollowUp = async () => {
        setFollowUpError(null);
        try {
            const data = await apiClient.post(`/api/leads/${id}/follow-up`);
            setLead(data.lead);
        } catch (err) {
            console.error("Follow-up error:", err);
            setFollowUpError(err.message || "Failed to establish AI logic paths.");
        }
    };

    const handleCopyResponse = () => {
        if (lead?.suggestedResponse) {
            navigator.clipboard.writeText(lead.suggestedResponse);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSendChat = async (text) => {
        const userMsg = text || chatMsg;
        if (!userMsg.trim()) return;

        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatMsg('');
        setIsTyping(true);

        try {
            const data = await apiClient.post(`/api/leads/${id}/chat`, { message: userMsg });
            setChatHistory(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (err) {
            setChatHistory(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    /* --- Rendering --- */

    if (loading) return <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /> Connecting Context Node...</div>;
    if (errorText) return <div className="p-12 text-center text-red-500 font-medium border border-red-200 bg-red-50 max-w-md mx-auto mt-12 rounded-xl flex items-center justify-center gap-2"><AlertCircle className="w-5 h-5" /> {errorText}</div>;
    if (!lead) return <div className="p-12 text-center text-red-500 font-medium">Lead not found.</div>;

    const isAnalyzed = lead.status === "Analyzed" || lead.summary;

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-24">

            {/* HEADER ROW */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors text-slate-500 shadow-sm bg-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                            {lead.customerName}
                        </h1>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{lead.id}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-medium text-slate-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {lead.location}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-medium text-slate-600 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lead.timeline}</span>
                            <span className="text-slate-300 hidden md:block">•</span>
                            <PriorityBadge priority={lead.priority} />
                            {isAnalyzed && lead.leadScore != null && (
                                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-indigo-200 bg-indigo-50 text-indigo-700 uppercase flex items-center gap-1">
                                    <Activity className="w-3 h-3" /> Score: {lead.leadScore}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Core Unified Action Bar */}
                <div className="flex items-center gap-3 shrink-0">
                    {!isAnalyzed ? (
                        <button onClick={handleAnalyze} disabled={analyzing} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                            Analyze Lead Context
                        </button>
                    ) : (
                        <button onClick={() => document.getElementById('chat-section').scrollIntoView({ behavior: 'smooth' })} className="bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Ask AI Agent
                        </button>
                    )}
                </div>
            </div>

            {/* SECTION BUCKETS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">

                {/* LEFT COLUMN: Customer Facts (Sec 1 & 2) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-6">
                        <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b uppercase tracking-wider flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> Customer Data</h2>

                        {/* Section 1 */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Requirement</p>
                                <p className="text-slate-800 text-sm font-medium">{lead.propertyRequirement}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Budget Target</p>
                                <p className="text-slate-800 text-sm font-medium">{lead.budget}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Location Pref</p>
                                <p className="text-slate-800 text-sm font-medium">{lead.location}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Purchase Timeline</p>
                                <p className="text-slate-800 text-sm font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-500" /> {lead.timeline}</p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Original Raw Message</p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed italic font-serif">
                                "{lead.customerMessage}"
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: AI Generation Blocks (Sec 3-7) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Not Analyzed Warning */}
                    {!isAnalyzed && !analyzing && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-12 text-center text-indigo-800 shadow-sm flex flex-col items-center justify-center">
                            <Bot className="w-12 h-12 mb-4 opacity-50" />
                            <h2 className="text-xl font-bold mb-2">AI Node Disconnected</h2>
                            <p className="text-sm opacity-80 max-w-sm mb-6">This customer payload lacks deterministic priority metrics. Trigger the AI models to populate actionable resolutions.</p>
                            <button onClick={handleAnalyze} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md font-semibold text-sm transition-all flex items-center gap-2">
                                <Bot className="w-5 h-5" /> Force Synthesis
                            </button>
                        </div>
                    )}

                    {analyzeError && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex gap-3 text-sm border border-red-100">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{analyzeError}</p>
                        </div>
                    )}

                    {/* Section 3 & 4 & 5: AI Analysis Block */}
                    {isAnalyzed && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">

                            <div className="bg-indigo-600 p-5 flex items-center justify-between shadow-inner">
                                <h2 className="text-base font-bold text-white flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-indigo-200" /> AI Diagnostic Map
                                </h2>
                                <div className="flex items-center gap-2">
                                    {lead.urgency && <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">Urgency: {lead.urgency}</span>}
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Sec 3 Main Attributes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-100 pb-6">
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Intent Classification</p>
                                        <p className="text-slate-800 text-sm font-semibold">{lead.intent}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">AI Executive Summary</p>
                                        <p className="text-slate-700 text-xs leading-relaxed">{lead.summary}</p>
                                    </div>
                                </div>

                                {/* Bullet Identifiers */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 pb-6">
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Validated Reqs
                                        </h3>
                                        <ul className="space-y-1.5">
                                            {lead.keyRequirements?.map((req, i) => (
                                                <li key={i} className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                                    <span className="text-green-500 font-bold mt-[1px]">•</span> <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Core Objections
                                        </h3>
                                        {lead.objections?.length > 0 ? (
                                            <ul className="space-y-1.5">
                                                {lead.objections.map((obj, i) => (
                                                    <li key={i} className="text-xs font-medium text-slate-600 flex items-start gap-2">
                                                        <span className="text-red-400 font-bold mt-[1px]">•</span> <span>{obj}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-xs font-semibold text-slate-400 italic">None detected in transcript.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Sec 4: Recommended Action */}
                                <div className="bg-indigo-50 border border-indigo-100/50 rounded-xl p-4 shadow-sm">
                                    <h3 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Recommended Progression Action</h3>
                                    <p className="font-semibold text-[13px] text-indigo-900">{lead.recommendedNextAction || lead.recommendedAction}</p>
                                </div>

                                {/* Sec 5: Suggested Response */}
                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest"><MessageSquare className="w-3.5 h-3.5 inline mr-1 text-slate-400" /> Auto-drafted Context Reply</h3>
                                        <button onClick={handleCopyResponse} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-md transition-colors flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                                            {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Reply</>}
                                        </button>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
                                        {lead.suggestedResponse}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION 6: Follow Up Assistant */}
                    {isAnalyzed && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                            <FollowUpAssistant
                                leadId={lead.id}
                                plan={lead.followUpPlan}
                                currentStatus={lead.followUpStatus}
                                error={followUpError}
                                onRefresh={handleGenerateFollowUp}
                                onAnalyze={handleAnalyze}
                            />
                        </div>
                    )}

                    {/* SECTION 7: Conversational AI Window */}
                    {isAnalyzed && (
                        <div id="chat-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 mt-8">
                            <div className="bg-slate-800 p-4 shrink-0 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-indigo-400" /> Interactive Sales Agent
                                </h2>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold">Locked to {lead.id}</span>
                            </div>

                            <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50/50 flex flex-col scroll-smooth">
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`px-4 py-3 max-w-[85%] text-sm leading-relaxed shadow-sm
                       ${msg.role === 'user'
                                                ? 'bg-slate-800 text-white rounded-2xl rounded-tr-sm font-medium'
                                                : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm'
                                            }`}
                                        >
                                            <span className="whitespace-pre-wrap">{msg.content}</span>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">Predicting Context...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Interaction Action Bars */}
                            <div className="px-4 pt-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                                {suggestedQuestions.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendChat(q)}
                                        disabled={isTyping}
                                        className="shrink-0 bg-slate-100 hover:bg-slate-200 border border-slate-200/50 text-slate-700 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all disabled:opacity-50"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>

                            <div className="p-4 bg-white shrink-0">
                                <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} className="relative flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all placeholder:text-slate-400 bg-slate-50 text-sm font-medium"
                                        placeholder="Command the AI..."
                                        value={chatMsg}
                                        onChange={(e) => setChatMsg(e.target.value)}
                                        disabled={isTyping}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!chatMsg.trim() || isTyping}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default LeadDetails;
