const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// Clean route structures mapped to the controller
router.get('/', leadController.getAllLeads);
router.get('/:id', leadController.getLeadById);
router.post('/', leadController.createLead);
router.post('/:id/analyze', leadController.analyzeLead);
router.post('/:id/chat', leadController.chatWithLead);
router.post('/:id/follow-up', leadController.generateFollowUp);

// Delete Lead (Destructive)
router.delete('/:id', leadController.deleteLead);

// Update Lead (Patch/Put mapping via MongoDB Atlas)
router.put('/:id', leadController.updateLead);

// TEMPORARY DEBUG ROUTE
router.post('/debug/test', async (req, res) => {
    try {
        const { GoogleGenAI } = require('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: req.body.message || "Hello"
        });
        res.json({
            success: true,
            typeof_text: typeof response.text,
            isFunction: typeof response.text === 'function',
            val: typeof response.text === 'function' ? response.text() : response.text,
            rawKeys: Object.keys(response)
        });
    } catch (e) {
        res.json({ success: false, error: e.message, stack: e.stack });
    }
});

module.exports = router;
