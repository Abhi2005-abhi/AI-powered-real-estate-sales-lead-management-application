import React from 'react';
import FormField from './FormField';

const BudgetField = ({ value, onChange, error }) => {
    return (
        <FormField label="Budget" id="budget" error={error} required>
            <input
                id="budget"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g. $500k, 1.2M, Flexible"
                className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
        </FormField>
    );
};

export default BudgetField;
