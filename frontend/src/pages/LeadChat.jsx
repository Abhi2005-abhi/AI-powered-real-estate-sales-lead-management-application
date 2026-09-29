import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User, Loader2, Sparkles, MapPin } from 'lucide-react';
import PriorityBadge from '../components/dashboard/PriorityBadge';

const LeadChat = () => {
    const { id } = useParams();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);

    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', content: "Hello! I'm your AI assistant. You can ask me anything about this lead's context, customer intent, or get suggestions for the next follow-up." }
    ]);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestedQuestions = [
        "What should I emphasize?",
        "What is the biggest objection?",
        "Draft a WhatsApp reply",
        "What should I ask next?",
        "How urgent is this lead?"
    ];

    useEffect(() => {
        fetch(`http://localhost:5000/api/leads/${id}`)
            .then(res => res.json())
            .then(data => {
                setLead(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch lead", err);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isTyping]);

    const handleSendMessage = async (text) => {
        const userMsg = text || message;
        if (!userMsg.trim()) return;

        // Append user msg to UI immediately
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setMessage('');
        setIsTyping(true);

        try {
            const res = await fetch(`http://localhost:5000/api/leads/${id}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Failed to chat.');

            setChatHistory(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500 text-lg flex flex-col items-center gap-2"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /> Connecting to AI workspace...</div>;
    if (!lead || lead.message === 'Lead not found') return <div className="p-12 text-center text-red-500 text-lg">Lead not found.</div>;

    return (
        <div className="max-w-[1400px] mx-auto h-[calc(100vh-8rem)] flex flex-col xl:flex-row gap-6 animate-in fade-in duration-300">

            {/* Left Sidebar Layout: Lead Context Profile */}
            <div className="xl:w-1/3 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col overflow-hidden shrink-0">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                    <Link to={`/leads/${id}`} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-500 bg-white shadow-sm border border-slate-200">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">{lead.customerName}</h2>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{lead.id}</span>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    <div>
                        <PriorityBadge priority={lead.priority} />
                        {lead.urgency && (
                            <span className="ml-2 px-2.5 py-1 rounded-full text-xs font-semibold border bg-purple-50 text-purple-700 border-purple-200">
                                Urgency: {lead.urgency}
                            </span>
                        )}
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-800 border-b pb-1">Customer Baseline</h3>
                        <div className="grid grid-cols-2 gap-y-3 overflow-hidden text-sm">
                            <div className="text-slate-500 font-medium">Location</div>
                            <div className="text-slate-800 font-medium text-right flex items-center justify-end gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {lead.location}</div>

                            <div className="text-slate-500 font-medium">Requirement</div>
                            <div className="text-slate-800 font-medium text-right">{lead.propertyRequirement}</div>

                            <div className="text-slate-500 font-medium">Budget</div>
                            <div className="text-slate-800 font-medium text-right">{lead.budget}</div>

                            <div className="text-slate-500 font-medium">Timeline</div>
                            <div className="text-slate-800 font-medium text-right">{lead.timeline}</div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Message</h3>
                        <p className="text-sm text-slate-700 font-serif whitespace-pre-wrap leading-relaxed">{lead.customerMessage}</p>
                    </div>

                    {/* If Analysis EXISTS */}
                    {lead.status === "Analyzed" && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-indigo-800 border-b border-indigo-100 pb-1 flex justify-between">
                                <span>AI Analysis Snapshots</span>
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                            </h3>

                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Intent Tracker</p>
                                <p className="text-sm text-slate-800 font-medium">{lead.intent}</p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Recommended Execution</p>
                                <div className="text-sm bg-indigo-50 text-indigo-800 border-l-2 border-indigo-500 pl-3 py-1 font-medium">{lead.recommendedNextAction}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Layout: Conversational Generative Chat Container */}
            <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col overflow-hidden relative">
                <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-2 shrink-0">
                    <Bot className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-md font-bold text-slate-800 tracking-tight">Lead AI Copilot</h2>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                px-5 py-3.5 max-w-[85%] text-sm leading-relaxed shadow-sm
                ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm'
                                }
              `}>
                                <span className="whitespace-pre-wrap">{msg.content}</span>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm px-5 py-3 max-w-[85%] shadow-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                <span className="text-sm">Synthesizing...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Chips Area */}
                <div className="px-4 pt-3 bg-white overflow-x-auto flex items-center gap-2 no-scrollbar border-t border-slate-100">
                    {suggestedQuestions.map((q, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSendMessage(q)}
                            disabled={isTyping}
                            className="shrink-0 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-transparent hover:border-indigo-200 text-slate-600 text-[13px] font-medium px-4 py-1.5 rounded-full transition-all disabled:opacity-50"
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {/* Input Box */}
                <div className="p-4 bg-white shrink-0">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                        className="relative"
                    >
                        <input
                            type="text"
                            className="w-full px-5 py-3.5 pr-14 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white text-sm"
                            placeholder="Ask a question about this lead..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || isTyping}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default LeadChat;
