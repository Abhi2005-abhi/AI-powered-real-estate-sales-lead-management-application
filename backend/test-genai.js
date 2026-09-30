const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: "DUMMY_KEY" });
async function test() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Hi",
            config: {
                responseMimeType: 'application/json'
            }
        });
        console.log(response);
    } catch (e) {
        console.error("SDK ERROR:", e.message);
    }
}
test();
