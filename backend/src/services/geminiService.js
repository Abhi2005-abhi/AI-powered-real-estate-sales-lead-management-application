const { GoogleGenAI } = require('@google/genai');

function extractJSON(text) {
    try {
        return JSON.parse(text);
    } catch (e) {
        let cleanText = text;
        if (cleanText.includes('```json')) {
            cleanText = cleanText.split('```json')[1].split('```')[0].trim();
        } else if (cleanText.includes('```')) {
            cleanText = cleanText.split('```')[1].split('```')[0].trim();
        }

        const start = cleanText.indexOf('{');
        const end = cleanText.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end >= start) {
            cleanText = cleanText.substring(start, end + 1);
        }
        return JSON.parse(cleanText);
    }
}

const analyzeLeadWithGemini = async (promptText) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set. Please configure the backend.');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelId = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: promptText,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const parsedData = extractJSON(response.text);

        const requiredKeys = ['summary', 'intent', 'keyRequirements', 'objections', 'recommendedNextAction', 'suggestedResponse', 'leadScore', 'priority', 'urgency', 'scoringSignals'];
        for (const key of requiredKeys) {
            if (parsedData[key] === undefined) {
                throw new Error(`Missing expected key: ${key}`);
            }
        }

        return parsedData;
    } catch (error) {
        console.error("AI service error - analyzeLeadWithGemini:", error);
        throw new Error('Gemini analysis failed: ' + (error.message || 'Malformed structured payload'));
    }
};

const generateChatResponse = async (promptText) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set. Please configure the backend.');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelId = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: promptText
        });

        return response.text.trim();
    } catch (error) {
        console.error('AI chat processing error:', error);
        throw new Error('Failed to generate response from Gemini chat model: ' + error.message);
    }
};

const generateFollowUpStrategy = async (promptText) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set. Please configure the backend.');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelId = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: promptText,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const parsedData = extractJSON(response.text);

        // Weakening strict key blocks. The frontend uses `safePlan` structural mapping defensively eliminating the need for aggressive backend rejections.
        if (!parsedData || typeof parsedData !== 'object') {
            throw new Error(`Invalid FollowUp structured block format.`);
        }

        return parsedData;
    } catch (error) {
        console.error("AI service error - generateFollowUpStrategy:", error);
        throw new Error('Gemini follow-up generation failed: ' + (error.message || 'JSON structure compromised'));
    }
};

module.exports = { analyzeLeadWithGemini, generateChatResponse, generateFollowUpStrategy };
