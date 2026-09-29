import React from 'react';
import LeadRow from './LeadRow';
import EmptyState from './EmptyState';

const LeadTable = ({ leads }) => {
    if (!leads || leads.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-left">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50/80">
                        <tr>
                            <th className="py-3 pl-6 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Requirement</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Timeline</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">AI Recommendation</th>
                            <th className="py-3 pl-4 pr-6"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {leads.map((lead) => (
                            <LeadRow key={lead.id} lead={lead} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeadTable;
