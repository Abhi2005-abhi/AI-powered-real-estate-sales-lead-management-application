import React from 'react';

const PriorityBadge = ({ priority }) => {
    const styles = {
        Hot: "bg-red-50 text-red-700 border-red-200",
        Warm: "bg-orange-50 text-orange-700 border-orange-200",
        Cold: "bg-blue-50 text-blue-700 border-blue-200",
        Unanalyzed: "bg-gray-50 text-gray-700 border-gray-200"
    };

    const style = styles[priority] || styles.Unanalyzed;
    const isHot = priority === "Hot";

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex w-min items-center gap-1 ${style}`}>
            {isHot && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>}
            {priority}
        </span>
    );
};

export default PriorityBadge;
