const buildFollowUpPrompt = (lead) => {
    return `You are generating an active, proactive sales action plan based on the lead context.
Analyze the provided lead information AND the existing AI analysis to determine the absolute best next step for the salesperson.

Lead Information:
- Name: ${lead.customerName}
- Requirement: ${lead.propertyRequirement}
- Timeline: ${lead.timeline}
- Customer Message: ${lead.customerMessage}

Existing AI Analysis Context:
- Summary: ${lead.summary || 'N/A'}
- Lead Score: ${lead.leadScore || 'N/A'}
- Priority: ${lead.priority || 'N/A'}
- Urgency: ${lead.urgency || 'N/A'}
- Recommended Next Action: ${lead.recommendedNextAction || 'N/A'}
- Objections: ${lead.objections ? lead.objections.join(', ') : 'None'}

Rules:
1. "timing" must be a concise recommended follow-up timeframe (e.g., "Within 24 hours", "Immediately").
2. "channel" must be the optimal outreach method (e.g., "WhatsApp", "Phone Call", "Email").
3. "objective" is a single sentence defining the goal of the outreach.
4. "talkingPoints" must be an array of short, impactful bullet phrases to discuss.
5. "suggestedMessage" must be a drafted template ready for copy-pasting via the chosen channel.
6. "questionsToAsk" must be an array of direct questions to extract more information.
7. "whatToAvoid" must be an array of warnings or actions the salesperson should categorically NOT do (e.g. "Do not push budget yet").
8. "priority" must be exactly: "HOT", "WARM", or "COLD".

Return valid JSON exactly mapping this structure:
{
  "timing": "...",
  "channel": "...",
  "objective": "...",
  "talkingPoints": ["...", "..."],
  "suggestedMessage": "...",
  "questionsToAsk": ["...", "..."],
  "whatToAvoid": ["...", "..."],
  "priority": "HOT | WARM | COLD"
}`;
};

module.exports = { buildFollowUpPrompt };
