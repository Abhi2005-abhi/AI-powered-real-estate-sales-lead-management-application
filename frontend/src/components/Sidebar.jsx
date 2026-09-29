import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UserPlus, List, MessageSquare, Briefcase } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" /> },
        { name: 'Add Lead', path: '/add-lead', icon: <UserPlus className="w-5 h-5" /> },
        { name: 'Follow-up Assistant', path: '/follow-up', icon: <List className="w-5 h-5" /> },
    ];

    return (
        <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">AI LeadPilot</span>
            </div>
            <nav className="flex-1 p-4 flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                ? 'bg-blue-50 text-blue-700 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                        end={item.path === '/'}
                    >
                        {item.icon}
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
