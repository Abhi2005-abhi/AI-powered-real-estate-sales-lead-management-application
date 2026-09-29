import React from 'react';

const FilterTabs = ({ activeFilter, setActiveFilter }) => {
    const tabs = ['All', 'Hot', 'Warm', 'Cold', 'High urgency'];

    return (
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeFilter === tab
                            ? 'bg-white text-slate-800 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default FilterTabs;
