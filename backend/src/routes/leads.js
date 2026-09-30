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
router.get('/debug/test', async (req, res) => {
    try {
        const fetch = require('node-fetch') || global.fetch;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        res.json({ success: true, models: data.models?.map(m => m.name) || data });
    } catch (e) {
        res.json({ success: false, error: e.message });
    }
});

module.exports = router;
