import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    return (
        <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                placeholder="Search by name or location..."
                onChange={(e) => onSearch?.(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
