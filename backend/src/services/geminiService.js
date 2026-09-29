const { GoogleGenerativeAI } = require('@google/generative-ai');

const analyzeLeadWithGemini = async (promptText) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set. Please configure the backend.');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(promptText);
        const response = await result.response;
        let text = response.text();

        if (text.includes('```json')) {
            text = text.split('```json')[1].split('```')[0].trim();
        } else if (text.includes('```')) {
            text = text.split('```')[1].split('```')[0].trim();
        }

        const parsedData = JSON.parse(text);

        const requiredKeys = ['summary', 'intent', 'keyRequirements', 'objections', 'recommendedNextAction', 'suggestedResponse', 'leadScore', 'priority', 'urgency', 'scoringSignals'];
        for (const key of requiredKeys) {
            if (parsedData[key] === undefined) {
                throw new Error(`Missing expected key: ${key}`);
            }
        }

        return parsedData;
    } catch (error) {
        console.error("AI service error:", error);
        throw new Error('Gemini analysis failed or returned malformed data.');
    }
};

const generateChatResponse = async (promptText) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set.');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(promptText);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('AI chat processing error:', error);
        throw new Error('Failed to generate response from Gemini chat model.');
    }
};

const generateFollowUpStrategy = async (promptText) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set.');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(promptText);
        const response = await result.response;
        let text = response.text();

        if (text.includes('```json')) {
            text = text.split('```json')[1].split('```')[0].trim();
        } else if (text.includes('```')) {
            text = text.split('```')[1].split('```')[0].trim();
        }

        const parsedData = JSON.parse(text);

        const requiredKeys = ['timing', 'channel', 'objective', 'talkingPoints', 'suggestedMessage', 'questionsToAsk', 'whatToAvoid', 'priority'];
        for (const key of requiredKeys) {
            if (parsedData[key] === undefined) {
                throw new Error(`Missing expected key: ${key} in FollowUp payload`);
            }
        }

        return parsedData;
    } catch (error) {
        console.error("AI service error:", error);
        throw new Error('Gemini follow-up generation failed or returned malformed data.');
    }
};

module.exports = { analyzeLeadWithGemini, generateChatResponse, generateFollowUpStrategy };
