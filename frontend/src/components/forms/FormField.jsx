import React from 'react';

const FormField = ({ label, id, children, error, required }) => {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium text-slate-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        </div>
    );
};

export default FormField;
