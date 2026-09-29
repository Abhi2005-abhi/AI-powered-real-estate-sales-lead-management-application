import React, { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import FilterTabs from '../components/dashboard/FilterTabs';
import SearchBar from '../components/dashboard/SearchBar';
import LeadTable from '../components/dashboard/LeadTable';
import { Users, Flame, Thermometer, CalendarClock, Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '../utils/apiClient';

const priorityWeight = { 'HOT': 3, 'WARM': 2, 'COLD': 1, 'Unanalyzed': 0 };
const urgencyWeight = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1, 'Unanalyzed': 0 };

const Dashboard = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const data = await apiClient.get('/api/leads');
                setLeads(data);
            } catch (err) {
                console.error("Failed to fetch leads", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    // Stats calculation dynamically derived from backend payload
    const totalLeads = leads.length;
    const hotLeads = leads.filter(l => l.priority === 'HOT' || l.priority === 'Hot').length;
    const warmLeads = leads.filter(l => l.priority === 'WARM' || l.priority === 'Warm').length;
    // Approximated "Follow-ups Due" mimicking SaaS dashboard action tracking constraints (High urgency counts)
    const followUpsDue = leads.filter(l => l.urgency === 'HIGH' || l.urgency === 'High').length;

    // Filter application
    let filteredLeads = [...leads];

    if (activeFilter !== 'All') {
        if (activeFilter === 'High urgency') {
            filteredLeads = filteredLeads.filter(l => l.urgency && l.urgency.toUpperCase() === 'HIGH');
        } else {
            filteredLeads = filteredLeads.filter(l => l.priority && l.priority.toUpperCase() === activeFilter.toUpperCase());
        }
    }

    if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        filteredLeads = filteredLeads.filter(l =>
            l.customerName.toLowerCase().includes(q) ||
            l.location.toLowerCase().includes(q)
        );
    }

    // Hierarchical Multi-tiered Sorting: Priority -> Score -> Urgency
    filteredLeads.sort((a, b) => {
        const pA = priorityWeight[a.priority?.toUpperCase()] || 0;
        const pB = priorityWeight[b.priority?.toUpperCase()] || 0;
        if (pA !== pB) return pB - pA; // Higher priorities first (Descending)

        const sA = a.leadScore || 0;
        const sB = b.leadScore || 0;
        if (sA !== sB) return sB - sA; // Higher score first (Descending)

        const uA = urgencyWeight[a.urgency?.toUpperCase()] || 0;
        const uB = urgencyWeight[b.urgency?.toUpperCase()] || 0;
        return uB - uA; // Higher urgency first (Descending)
    });

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Stats Section */}
            {errorText ? (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-700 flex items-center gap-2 shadow-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorText}</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Leads" value={totalLeads} subtitle="Last 30 days" icon={Users} color="blue" />
                    <StatCard title="Hot Leads" value={hotLeads} subtitle="High intent" icon={Flame} color="red" />
                    <StatCard title="Warm Leads" value={warmLeads} subtitle="Needs nurturing" icon={Thermometer} color="orange" />
                    <StatCard title="Follow-ups Due" value={followUpsDue} subtitle="High urgency" icon={CalendarClock} color="green" />
                </div>
            )}

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <FilterTabs activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    <SearchBar onSearch={setSearchQuery} />
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        Pulling latest leads network queue...
                    </div>
                ) : (
                    <LeadTable leads={filteredLeads} />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
