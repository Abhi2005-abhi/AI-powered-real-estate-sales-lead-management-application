import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from './FormField';
import PropertyRequirementField from './PropertyRequirementField';
import BudgetField from './BudgetField';
import TimelineField from './TimelineField';
import { Loader2 } from 'lucide-react';

const LeadForm = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [formData, setFormData] = useState({
        customerName: '',
        location: '',
        propertyRequirement: '',
        budget: '',
        timeline: '',
        customerMessage: ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setIsSubmitting(true);

        try {
            // Basic validation handled by 'required' attributes, but backend will also validate.
            const res = await fetch('http://localhost:5000/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to submit the lead. Please try again.');
            }

            // Success, route to Lead Details
            navigate(`/leads/${data.id}`);
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium text-sm">
                    {errorMsg}
                </div>
            )}

            <div className="space-y-5">
                <FormField label="Customer Name" id="customerName" required>
                    <input
                        id="customerName"
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => handleChange('customerName', e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="e.g. John Doe"
                    />
                </FormField>

                <FormField label="Location" id="location" required>
                    <input
                        id="location"
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="e.g. Downtown Seattle, WA"
                    />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <PropertyRequirementField
                        value={formData.propertyRequirement}
                        onChange={(val) => handleChange('propertyRequirement', val)}
                    />
                    <BudgetField
                        value={formData.budget}
                        onChange={(val) => handleChange('budget', val)}
                    />
                </div>

                <TimelineField
                    value={formData.timeline}
                    onChange={(val) => handleChange('timeline', val)}
                />

                <FormField label="Customer Message (Raw)" id="customerMessage" required>
                    <textarea
                        id="customerMessage"
                        required
                        rows="5"
                        value={formData.customerMessage}
                        onChange={(e) => handleChange('customerMessage', e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                        placeholder="Paste WhatsApp inquiry, email, or chat transcript here..."
                    ></textarea>
                </FormField>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center justify-center min-w-[160px] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Lead'
                    )}
                </button>
            </div>
        </form>
    );
};

export default LeadForm;
