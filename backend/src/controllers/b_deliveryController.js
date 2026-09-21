import {
  getAllDeliveries,
  getLatestDeliveryLocation
} from '../models/deliveryModel.js';

// Return all deliveries to the frontend.
export async function fetchDeliveries(req, res) {
  try {
    const deliveries = await getAllDeliveries();

    res.json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries:', error.message);

    res.status(500).json({
      message: 'Failed to fetch deliveries'
    });
  }
}

// Return the latest GPS location for one delivery.
export async function fetchLatestDeliveryLocation(req, res) {
  try {
    const { deliveryId } = req.params;

    const location = await getLatestDeliveryLocation(deliveryId);

    if (!location) {
      return res.status(404).json({
        message: 'No GPS location found for this delivery'
      });
    }

    res.json(location);
  } catch (error) {
    console.error('Error fetching delivery location:', error.message);

    res.status(500).json({
      message: 'Failed to fetch delivery location'
    });
  }
}
