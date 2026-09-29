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

module.exports = router;
