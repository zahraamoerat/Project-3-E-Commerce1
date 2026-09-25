import express from 'express';
import {
  fetchDeliveries,
  fetchLatestDeliveryLocation,
  fetchDeliveryDestination,
  fetchDeliveryPickup,
  fetchDeliveryRoute,
  fetchDeliverySetup,
  persistDeliverySetup,
  fetchGeocode
} from '../controllers/b_deliveryController.js';

const router = express.Router();

// GET /api/deliveries
router.get('/', fetchDeliveries);

// GET /api/deliveries/geocode?q=
router.get('/geocode', fetchGeocode);

// GET /api/deliveries/:deliveryId/location
router.get('/:deliveryId/location', fetchLatestDeliveryLocation);

// GET /api/deliveries/:deliveryId/destination
router.get('/:deliveryId/destination', fetchDeliveryDestination);

// GET /api/deliveries/:deliveryId/pickup
router.get('/:deliveryId/pickup', fetchDeliveryPickup);

// GET /api/deliveries/:deliveryId/setup
router.get('/:deliveryId/setup', fetchDeliverySetup);

// POST /api/deliveries/:deliveryId/setup
router.post('/:deliveryId/setup', persistDeliverySetup);

// GET /api/deliveries/:deliveryId/route?pickupLat=&pickupLng=&destinationLat=&destinationLng=
router.get('/:deliveryId/route', fetchDeliveryRoute);

export default router;