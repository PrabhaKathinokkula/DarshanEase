const express = require('express');
const router = express.Router();
const { getOrganizerDashboard, getAdminDashboard } = require('../controllers/dashboardController');
const { protect, organizer, admin } = require('../middleware/authMiddleware');

router.get('/organizer', protect, organizer, getOrganizerDashboard);
router.get('/admin', protect, admin, getAdminDashboard);

module.exports = router;