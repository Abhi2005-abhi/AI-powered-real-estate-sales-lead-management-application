const { analyzeLeadWithGemini, generateChatResponse, generateFollowUpStrategy } = require('../services/geminiService');
const { buildAnalysisPrompt } = require('../prompts/leadAnalysisPrompt');
const { buildChatPrompt } = require('../prompts/leadChatPrompt');
const { buildFollowUpPrompt } = require('../prompts/leadFollowUpPrompt');
const Lead = require('../models/Lead');
const mongoose = require('mongoose');

const getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.status(200).json(leads);
    } catch (e) {
        res.status(500).json({ message: "Internal server error retrieving leads." });
    }
};

const getLeadById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Invalid Lead ID Format.' });
        }
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found.' });
        res.status(200).json(lead);
    } catch (e) {
        res.status(500).json({ message: "Internal server error." });
    }
};

const createLead = async (req, res) => {
    try {
        const { customerName, location, propertyRequirement, budget, timeline, customerMessage } = req.body;

        if (!customerName || customerName.trim() === '') return res.status(400).json({ message: 'Customer Name is required.' });
        if (!location || location.trim() === '') return res.status(400).json({ message: 'Location is required.' });
        if (!propertyRequirement || propertyRequirement.trim() === '') return res.status(400).json({ message: 'Property Requirement is required.' });
        if (!budget || budget.trim() === '') return res.status(400).json({ message: 'Budget is required.' });
        if (!timeline || timeline.trim() === '') return res.status(400).json({ message: 'Timeline is required.' });
        if (!customerMessage || customerMessage.trim() === '') return res.status(400).json({ message: 'Customer message cannot be empty.' });

        const newLead = await Lead.create({
            customerName,
            location,
            propertyRequirement,
            budget,
            timeline,
            customerMessage
        });

        res.status(201).json(newLead);
    } catch (e) {
        res.status(500).json({ message: "Server error occurred while creating lead." });
    }
};

const analyzeLead = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Invalid Lead ID Format.' });
        }

        const targetLead = await Lead.findById(req.params.id);
        if (!targetLead) {
            return res.status(404).json({ message: 'Lead not found.' });
        }

        const promptText = buildAnalysisPrompt(targetLead);
        const analysis = await analyzeLeadWithGemini(promptText);

        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            { ...analysis, status: "Analyzed" },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: 'Lead analyzed successfully', lead: updatedLead });
    } catch (error) {
        console.error("Analysis Error Constraint Hit:", error.message);
        return res.status(503).json({
            message: 'AI Lead Analysis is temporarily unavailable.'
        });
    }
};

const chatWithLead = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Invalid Lead ID Format.' });
        }

        const { message } = req.body;
        if (!message || message.trim() === '') {
            return res.status(400).json({ message: "A salesperson message question cannot be empty." });
        }

        const targetLead = await Lead.findById(req.params.id);
        if (!targetLead) {
            return res.status(404).json({ message: 'Lead not found.' });
        }

        const promptText = buildChatPrompt(targetLead, message);
        const aiResponse = await generateChatResponse(promptText);

        res.status(200).json({ answer: aiResponse });
    } catch (error) {
        return res.status(503).json({
            message: 'Conversational agent is temporarily unavailable. Please try again.'
        });
    }
};

const generateFollowUp = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Invalid Lead ID Format.' });
        }

        const targetLead = await Lead.findById(req.params.id);
        if (!targetLead) {
            return res.status(404).json({ message: 'Lead not found.' });
        }

        const promptText = buildFollowUpPrompt(targetLead);
        const followUpPlan = await generateFollowUpStrategy(promptText);

        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            { followUpPlan: followUpPlan, followUpStatus: "Follow-up Needed" },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: 'Follow-up strategy generated successfully', lead: updatedLead });
    } catch (error) {
        return res.status(503).json({
            message: 'AI strategizing models are temporarily unresponsive.'
        });
    }
};

const updateLead = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(404).json({ message: 'Invalid Lead ID Format.' });

        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!lead) return res.status(404).json({ message: 'Lead not found.' });
        res.status(200).json(lead);
    } catch (e) {
        res.status(500).json({ message: "Internal server error." });
    }
};

const deleteLead = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(404).json({ message: 'Invalid Lead ID Format.' });

        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found.' });
        res.status(200).json({ message: 'Lead deleted successfully.' });
    } catch (e) {
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    getAllLeads,
    getLeadById,
    createLead,
    analyzeLead,
    chatWithLead,
    generateFollowUp,
    updateLead,
    deleteLead
};
