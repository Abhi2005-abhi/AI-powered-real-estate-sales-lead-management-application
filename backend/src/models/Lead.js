const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    location: { type: String, required: true },
    propertyRequirement: { type: String, required: true },
    budget: { type: String, required: true },
    timeline: { type: String, required: true },
    customerMessage: { type: String, required: true },
    status: { type: String, default: 'New' },
    priority: { type: String, default: 'Unanalyzed' },
    intent: { type: String, default: 'Pending AI Analysis' },
    recommendedAction: { type: String, default: 'Awaiting constraints analysis' },
    recommendedNextAction: { type: String },
    followUpStatus: { type: String, default: 'Follow-up Needed' },
    summary: { type: String },
    keyRequirements: [{ type: String }],
    objections: [{ type: String }],
    suggestedResponse: { type: String },
    leadScore: { type: Number },
    urgency: { type: String },
    scoringSignals: { type: mongoose.Schema.Types.Mixed },
    followUpPlan: { type: mongoose.Schema.Types.Mixed }
}, {
    timestamps: true
});

leadSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
