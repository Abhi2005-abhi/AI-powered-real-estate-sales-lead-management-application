import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Phone, CheckCircle, Clock } from 'lucide-react';
import { apiClient } from '../utils/apiClient';

const FollowUp = () => {
    const [followUps, setFollowUps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFollowUps = async () => {
            try {
                const data = await apiClient.get('/api/leads');
                const filtered = data.filter(lead => lead.followUpStatus === 'Follow-up Needed');
                setFollowUps(filtered);
            } catch (err) {
                console.error("Error fetching follow-ups:", err);
                setError(err.message || 'Failed to load follow-up tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchFollowUps();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-8 bg-red-50 p-6 rounded-xl border border-red-200 text-center">
                <p className="text-red-700 font-medium">Error: {error}</p>
            </div>
        );
    }

    if (followUps.length === 0) {
        return (
            <div className="max-w-4xl mx-auto mt-16 bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <CheckCircle className="w-12 h-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">No follow-ups scheduled</h2>
                <p className="text-slate-500 text-center max-w-sm mb-6">
                    You've successfully cleared your active planner! Monitor your dashboard for new automated constraints mapping.
                </p>
                <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header className="flex justify-between items-end pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Follow-up Assistant</h1>
                    <p className="text-slate-500 mt-1">Manage scheduled engagements securely powered by AI.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {followUps.map(lead => (
                    <div key={lead.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-lg text-slate-800">{lead.customerName}</h3>
                                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                    <Clock className="w-4 h-4" /> {new Date(lead.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                                Action Needed
                            </span>
                        </div>

                        <div className="flex-1">
                            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[4rem] mb-4 line-clamp-3">
                                {lead.followUpPlan ? lead.followUpPlan : lead.customerMessage}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link to={`/leads/${lead.id}`} className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors">
                                <Phone className="w-4 h-4" /> Engage
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FollowUp;
