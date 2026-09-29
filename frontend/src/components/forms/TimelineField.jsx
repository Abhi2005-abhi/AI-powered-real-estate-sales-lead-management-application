import React from 'react';
import FormField from './FormField';

const TimelineField = ({ value, onChange, error }) => {
    const timelines = [
        "Immediately", "Within 1 month", "1–3 months", "3–6 months", "Just exploring"
    ];

    return (
        <FormField label="Buying Timeline" id="timeline" error={error} required>
            <select
                id="timeline"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
                <option value="" disabled>Select Timeline</option>
                {timelines.map(time => (
                    <option key={time} value={time}>{time}</option>
                ))}
            </select>
        </FormField>
    );
};

export default TimelineField;
