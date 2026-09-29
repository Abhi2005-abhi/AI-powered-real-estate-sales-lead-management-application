const { analyzeLeadWithGemini, generateChatResponse, generateFollowUpStrategy } = require('../services/geminiService');
const { buildAnalysisPrompt } = require('../prompts/leadAnalysisPrompt');
const { buildChatPrompt } = require('../prompts/leadChatPrompt');
const { buildFollowUpPrompt } = require('../prompts/leadFollowUpPrompt');

let leads = [
    {
        id: "LD-1001",
        customerName: "Sarah Jenkins",
        location: "Downtown Seattle",
        propertyRequirement: "3 BHK Apartment",
        budget: "$850k",
        timeline: "Within 1 month",
        customerMessage: "Hi, I'm looking for a premium apartment.",
        status: "New",
        priority: "Unanalyzed",
        intent: "Pending AI Analysis",
        recommendedAction: "Awaiting constraints analysis",
        followUpStatus: "Follow-up Needed",
        createdAt: new Date().toISOString()
    }
];

const getAllLeads = (req, res) => {
    try {
        res.status(200).json(leads);
    } catch (e) {
        res.status(500).json({ message: "Internal server error retrieving leads." });
    }
};

const getLeadById = (req, res) => {
    try {
        const lead = leads.find(l => l.id === req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found.' });
        res.status(200).json(lead);
    } catch (e) {
        res.status(500).json({ message: "Internal server error." });
    }
};

const createLead = (req, res) => {
    try {
        const { customerName, location, propertyRequirement, budget, timeline, customerMessage } = req.body;

        // Explicit Validation Rules mapping HTTP 400
        if (!customerName || customerName.trim() === '') return res.status(400).json({ message: 'Customer Name is required.' });
        if (!location || location.trim() === '') return res.status(400).json({ message: 'Location is required.' });
        if (!propertyRequirement || propertyRequirement.trim() === '') return res.status(400).json({ message: 'Property Requirement is required.' });
        if (!budget || budget.trim() === '') return res.status(400).json({ message: 'Budget is required.' });
        if (!timeline || timeline.trim() === '') return res.status(400).json({ message: 'Timeline is required.' });
        if (!customerMessage || customerMessage.trim() === '') return res.status(400).json({ message: 'Customer message cannot be empty.' });

        const newLead = {
            id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
            customerName,
            location,
            propertyRequirement,
            budget,
            timeline,
            customerMessage,
            status: "New",
            priority: "Unanalyzed",
            intent: "Pending AI Analysis",
            recommendedAction: "Awaiting constraints analysis",
            followUpStatus: "Follow-up Needed",
            createdAt: new Date().toISOString()
        };

        leads.push(newLead);
        res.status(201).json(newLead);
    } catch (e) {
        res.status(500).json({ message: "Server error occurred while creating lead." });
    }
};

const analyzeLead = async (req, res) => {
    const { id } = req.params;
    const leadIndex = leads.findIndex(l => l.id === id);

    if (leadIndex === -1) {
        return res.status(404).json({ message: 'Lead not found.' });
    }

    const targetLead = leads[leadIndex];
    const promptText = buildAnalysisPrompt(targetLead);

    try {
        const analysis = await analyzeLeadWithGemini(promptText);

        const updatedLead = {
            ...targetLead,
            ...analysis,
            status: "Analyzed"
        };

        leads[leadIndex] = updatedLead;

        return res.status(200).json({ message: 'Lead analyzed successfully', lead: updatedLead });
    } catch (error) {
        console.error("Analysis Error Constraint Hit."); // hide native trace
        return res.status(503).json({
            message: 'AI Lead Analysis is temporarily unavailable.'
        });
    }
};

const chatWithLead = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === '') {
        return res.status(400).json({ message: "A salesperson message question cannot be empty." });
    }

    const targetLead = leads.find(l => l.id === id);

    if (!targetLead) {
        return res.status(404).json({ message: 'Lead not found.' });
    }

    const promptText = buildChatPrompt(targetLead, message);

    try {
        const aiResponse = await generateChatResponse(promptText);
        res.status(200).json({ answer: aiResponse });
    } catch (error) {
        return res.status(503).json({
            message: 'Conversational agent is temporarily unavailable. Please try again.'
        });
    }
};

const generateFollowUp = async (req, res) => {
    const { id } = req.params;
    const leadIndex = leads.findIndex(l => l.id === id);

    if (leadIndex === -1) {
        return res.status(404).json({ message: 'Lead not found.' });
    }

    const targetLead = leads[leadIndex];

    // Prevent multiple generations if already actively generating. This is purely visual mapping on frontend mostly, but we can do a secondary check here.
    const promptText = buildFollowUpPrompt(targetLead);

    try {
        const followUpPlan = await generateFollowUpStrategy(promptText);

        const updatedLead = {
            ...targetLead,
            followUpPlan: followUpPlan,
            followUpStatus: "Follow-up Needed"
        };

        leads[leadIndex] = updatedLead;
        return res.status(200).json({ message: 'Follow-up strategy generated successfully', lead: updatedLead });
    } catch (error) {
        return res.status(503).json({
            message: 'AI strategizing models are temporarily unresponsive.'
        });
    }
};

module.exports = {
    getAllLeads,
    getLeadById,
    createLead,
    analyzeLead,
    chatWithLead,
    generateFollowUp,
    leads
};
