const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getUpcomingAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDashboardStats,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/upcoming', getUpcomingAppointments);
router.get('/stats', getDashboardStats);

router.route('/')
  .get(getAppointments)
  .post(createAppointment);

router.route('/:id')
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;
