import React from 'react';
import FormField from './FormField';

const PropertyRequirementField = ({ value, onChange, error }) => {
    const options = [
        "2 BHK", "3 BHK", "Villa", "Plot", "Commercial property", "Office", "Other"
    ];

    return (
        <FormField label="Property Requirement" id="propertyRequirement" error={error} required>
            <select
                id="propertyRequirement"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
                <option value="" disabled>Select Requirement</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </FormField>
    );
};

export default PropertyRequirementField;
