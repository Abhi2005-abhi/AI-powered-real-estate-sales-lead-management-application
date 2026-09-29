import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, IndianRupee, MapPin, Calendar, MessageSquare, User, Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '../utils/apiClient';

const AddLead = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: '',
        location: '',
        propertyRequirement: '',
        budget: '',
        timeline: '',
        customerMessage: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorText, setErrorText] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.customerName || !formData.location || !formData.propertyRequirement || !formData.budget || !formData.timeline || !formData.customerMessage) {
            setErrorText('Please completely populate all lead properties securely.');
            return;
        }

        if (isSubmitting) return; // Prevent double submit
        setIsSubmitting(true);
        setErrorText(null);

        try {
            const createdLead = await apiClient.post('/api/leads', formData);
            navigate(`/leads/${createdLead.id}`);
        } catch (error) {
            setErrorText(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Capture Lead</h1>
                <p className="text-slate-500 mt-2">Log a new real-estate buyer payload resolving constraints instantly for AI evaluation loops.</p>
            </div>

            {errorText && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorText}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Customer Identifier</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            required
                            fullWidth
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white text-sm"
                            placeholder="e.g. Rahul Sharma"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Geographic Target</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                required
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white text-sm"
                                placeholder="South Delhi"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Property Layout</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                required
                                name="propertyRequirement"
                                value={formData.propertyRequirement}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white text-sm"
                                placeholder="4 BHK Villa"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Budget Allocation</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                required
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white text-sm"
                                placeholder="₹3.5 Cr limit"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Purchasing Timeline</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                required
                                name="timeline"
                                value={formData.timeline}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white text-sm"
                                placeholder="Immediate / Discovered"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Raw Customer Intent Log</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                        <textarea
                            required
                            name="customerMessage"
                            value={formData.customerMessage}
                            onChange={handleChange}
                            rows="4"
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white text-sm resize-none"
                            placeholder="Paste the raw text message tracking their exact conversation rules constraints..."
                        ></textarea>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Executing Creation Route...</>
                        ) : (
                            "Log Lead Constraints"
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddLead;
