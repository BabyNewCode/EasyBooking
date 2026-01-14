const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  getRoomAvailability,
  createRoom
} = require('../controllers/roomController');
const authMiddleware = require('../middleware/auth');

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.get('/:id/availability', getRoomAvailability);
router.post('/', authMiddleware, createRoom);

module.exports = router;
