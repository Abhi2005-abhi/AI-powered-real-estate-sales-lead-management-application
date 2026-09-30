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
router.get('/debug/test', (req, res) => {
    const https = require('https');
    https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`, (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => {
            try {
                const parsed = JSON.parse(data);
                res.json({ success: true, models: parsed.models?.map(m => m.name) || parsed });
            } catch (e) {
                res.json({ success: false, error: e.message, data });
            }
        });
    }).on("error", (err) => {
        res.json({ success: false, error: err.message });
    });
});

module.exports = router;
