import React from 'react';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = () => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center flex flex-col items-center shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No Leads Found</h3>
            <p className="text-slate-500 max-w-sm mb-6">You don't have any leads matching the current criteria. Add new prospects to begin tracking.</p>
            <Link
                to="/add-lead"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-colors shadow-sm"
            >
                Add New Lead
            </Link>
        </div>
    );
};

export default EmptyState;
