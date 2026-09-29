import React from 'react';
import { User, Bell, Searchend } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
            <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">Lead Dashboard</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">Prioritize your hottest opportunities</p>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Abhi Sales</p>
                        <p className="text-xs text-slate-500">Real Estate Agent</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
                        <User className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
