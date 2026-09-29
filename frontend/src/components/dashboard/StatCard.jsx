import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
    const colorMap = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        red: "text-red-600 bg-red-50 border-red-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100",
        green: "text-green-600 bg-green-50 border-green-100",
    };

    const selectedColor = colorMap[color] || colorMap.blue;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                    {(subtitle || subtitle === 0) && (
                        <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-50 inline-block px-2 py-0.5 rounded-md border border-slate-100">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={`p-2.5 rounded-lg border flex items-center justify-center ${selectedColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
