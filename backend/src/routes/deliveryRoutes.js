import express from 'express';
import {
  fetchDeliveries,
  fetchLatestDeliveryLocation
} from '../controllers/deliveryController.js';

const router = express.Router();

// GET /api/deliveries
router.get('/', fetchDeliveries);

// GET /api/deliveries/:deliveryId/location
router.get('/:deliveryId/location', fetchLatestDeliveryLocation);

export default router;
