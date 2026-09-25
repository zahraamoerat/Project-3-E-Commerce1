import {
  getAllDeliveries,
  getDeliveryAddressContext,
  getLatestDeliveryLocation,
  saveDeliverySetup
} from '../models/b_deliveryModel.js';

// Free OpenStreetMap services used for destination lookup and route
// calculation. Both are part of the same OSM ecosystem the frontend map
// already uses, and neither requires an API key.
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

// Nominatim asks clients to identify themselves.
const USER_AGENT = 'WeConnectDeliverySetup/1.0 (institutional e-commerce demo)';

// Return all deliveries to the frontend.
export async function fetchDeliveries(req, res) {
  try {
    const buyerId = req.query.buyerId ? Number(req.query.buyerId) : null;
    const deliveries = await getAllDeliveries(buyerId);

    res.json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries:', error.message);

    res.status(500).json({
      message: 'Failed to fetch deliveries'
    });
  }
}

// Geocode a saved address into real coordinates.
async function geocodeAddress(input) {
  const query = input.filter(Boolean).join(', ');

  if (!query) {
    return null;
  }

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', query);

  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT
    },
    signal: AbortSignal.timeout(12000)
  });

  if (!response.ok) {
    throw new Error('Geocoding service unavailable');
  }

  const results = await response.json();

  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const latitude = Number(results[0].lat);
  const longitude = Number(results[0].lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

// Build the address parts for a buyer or supplier place.
function placeAddress(place) {
  return [
    place.address,
    place.city,
    place.province,
    place.postal_code
  ];
}

// Geocode an individual location (buyer destination or supplier pickup).
async function resolvePlace(context, role) {
  const isDestination = role === 'destination';

  const place = {
    name: isDestination ? context.buyer_name : context.supplier_name,
    address: isDestination ? context.buyer_address : context.supplier_address,
    city: isDestination ? context.buyer_city : context.supplier_city,
    province: isDestination ? context.buyer_province : context.supplier_province,
    postal_code: isDestination ? context.buyer_postal_code : context.supplier_postal_code
  };

  const address = placeAddress(place);

  let coordinates = null;
  let status = 'unavailable';
  let notice = isDestination
    ? 'No delivery address is recorded for this business yet.'
    : 'No pickup address is recorded for this supplier yet.';

  if (address.some(part => part)) {
    try {
      coordinates = await geocodeAddress(address);
    } catch (error) {
      console.error(`${role} geocoding error:`, error.message);
    }

    if (coordinates) {
      status = 'resolved';
      notice = isDestination
        ? 'Located from the saved delivery address.'
        : 'Located from the supplier warehouse address.';
    } else {
      notice = isDestination
        ? 'The saved delivery address could not be located on the map right now.'
        : 'The supplier warehouse address could not be located on the map right now.';
    }
  }

  return { place, coordinates, status, notice };
}

// Return the delivery destination with real coordinates when the saved
// address can be located.
export async function fetchDeliveryDestination(req, res) {
  const deliveryId = Number(req.params.deliveryId);

  try {
    if (!Number.isInteger(deliveryId) || deliveryId <= 0) {
      return res.status(400).json({ message: 'Invalid delivery ID' });
    }

    const context = await getDeliveryAddressContext(deliveryId);

    if (!context) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    const resolved = await resolvePlace(context, 'destination');

    res.json({
      delivery_id: context.delivery_id,
      order_number: context.order_number,
      supplier_name: context.supplier_name,
      destination: resolved.place,
      coordinates: resolved.coordinates,
      status: resolved.status,
      notice: resolved.notice
    });
  } catch (error) {
    console.error('Error preparing delivery destination:', error.message);

    res.status(500).json({
      message: 'Failed to prepare delivery destination'
    });
  }
}

// Return the pickup location with real coordinates when the supplier
// warehouse address can be located.
export async function fetchDeliveryPickup(req, res) {
  const deliveryId = Number(req.params.deliveryId);

  try {
    if (!Number.isInteger(deliveryId) || deliveryId <= 0) {
      return res.status(400).json({ message: 'Invalid delivery ID' });
    }

    const context = await getDeliveryAddressContext(deliveryId);

    if (!context) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    const resolved = await resolvePlace(context, 'pickup');

    res.json({
      delivery_id: context.delivery_id,
      order_number: context.order_number,
      pickup: resolved.place,
      coordinates: resolved.coordinates,
      status: resolved.status,
      notice: resolved.notice
    });
  } catch (error) {
    console.error('Error preparing delivery pickup:', error.message);

    res.status(500).json({
      message: 'Failed to prepare delivery pickup'
    });
  }
}

// Return the confirmed setup state and saved addresses for one delivery.
export async function fetchDeliverySetup(req, res) {
  const deliveryId = Number(req.params.deliveryId);

  try {
    if (!Number.isInteger(deliveryId) || deliveryId <= 0) {
      return res.status(400).json({ message: 'Invalid delivery ID' });
    }

    const context = await getDeliveryAddressContext(deliveryId);

    if (!context) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json({
      delivery_id: context.delivery_id,
      order_number: context.order_number,
      delivery_method: context.delivery_method,
      current_status: context.current_status,
      buyer: {
        name: context.buyer_name,
        address: context.buyer_address,
        city: context.buyer_city,
        province: context.buyer_province,
        postal_code: context.buyer_postal_code
      },
      supplier: {
        name: context.supplier_name,
        address: context.supplier_address,
        city: context.supplier_city,
        province: context.supplier_province,
        postal_code: context.supplier_postal_code
      },
      pickup: context.pickup_latitude != null
        ? {
            label: context.pickup_label,
            latitude: Number(context.pickup_latitude),
            longitude: Number(context.pickup_longitude)
          }
        : null,
      destination_set: context.destination_latitude != null
        ? {
            label: context.destination_label,
            latitude: Number(context.destination_latitude),
            longitude: Number(context.destination_longitude)
          }
        : null,
      route: context.route_distance_m != null
        ? {
            distance_m: Number(context.route_distance_m),
            duration_s: Number(context.route_duration_s)
          }
        : null,
      setup_confirmed_at: context.setup_confirmed_at
    });
  } catch (error) {
    console.error('Error loading delivery setup:', error.message);

    res.status(500).json({
      message: 'Failed to load delivery setup'
    });
  }
}

// Accept and persist the confirmed pickup, destination, and route snapshot.
export async function persistDeliverySetup(req, res) {
  const deliveryId = Number(req.params.deliveryId);

  try {
    if (!Number.isInteger(deliveryId) || deliveryId <= 0) {
      return res.status(400).json({ message: 'Invalid delivery ID' });
    }

    const place = value => {
      const latitude = Number(value?.latitude);
      const longitude = Number(value?.longitude);

      if (
        !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        !Number.isFinite(longitude) || longitude < -180 || longitude > 180
      ) {
        return null;
      }

      return {
        label: typeof value?.label === 'string' ? String(value.label).trim().slice(0, 150) : null,
        latitude,
        longitude
      };
    };

    const pickup = place(req.body?.pickup);
    const destination = place(req.body?.destination);

    if (!pickup || !destination) {
      return res.status(400).json({
        message: 'Valid pickup and destination coordinates are required.'
      });
    }

    const distanceM = Number(req.body?.route?.distance_m);
    const durationS = Number(req.body?.route?.duration_s);

    const route = {
      distance_m: Number.isFinite(distanceM) && distanceM >= 0 ? distanceM : null,
      duration_s: Number.isFinite(durationS) && durationS >= 0 ? durationS : null
    };

    await saveDeliverySetup(deliveryId, {
      pickup_label: pickup.label,
      pickup_latitude: pickup.latitude,
      pickup_longitude: pickup.longitude,
      destination_label: destination.label,
      destination_latitude: destination.latitude,
      destination_longitude: destination.longitude,
      route_distance_m: route.distance_m,
      route_duration_s: route.duration_s
    });

    res.json({
      delivery_id: Number(deliveryId),
      status: 'confirmed',
      message: 'Delivery location and route confirmed.'
    });
  } catch (error) {
    console.error('Error saving delivery setup:', error.message);

    res.status(500).json({
      message: 'Failed to save delivery setup'
    });
  }
}

// Geocode any address the user enters while setting up the delivery.
export async function fetchGeocode(req, res) {
  try {
    const query = String(req.query.q || '').trim();

    if (!query || query.length > 250) {
      return res.status(400).json({ message: 'A valid address is required.' });
    }

    const coordinates = await geocodeAddress([query]);

    if (!coordinates) {
      return res.json({
        status: 'unavailable',
        query,
        coordinates: null
      });
    }

    res.json({
      status: 'resolved',
      query,
      coordinates
    });
  } catch (error) {
    console.error('Geocoding error:', error.message);

    res.status(500).json({
      status: 'error',
      message: 'The geocoding service could not be reached right now.'
    });
  }
}

// Calculate a real driving route between the pickup origin and the
// delivery destination.
export async function fetchDeliveryRoute(req, res) {
  const deliveryId = Number(req.params.deliveryId);

  const originLat = Number(req.query.originLat ?? req.query.pickupLat);
  const originLng = Number(req.query.originLng ?? req.query.pickupLng);

  const destinationLat = Number(req.query.destinationLat);
  const destinationLng = Number(req.query.destinationLng);

  try {
    if (
      !Number.isInteger(deliveryId) ||
      deliveryId <= 0 ||
      !Number.isFinite(originLat) || originLat < -90 || originLat > 90 ||
      !Number.isFinite(originLng) || originLng < -180 || originLng > 180
    ) {
      return res.status(400).json({ message: 'Invalid origin or delivery ID' });
    }

    const context = await getDeliveryAddressContext(deliveryId);

    if (!context) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    let destination = null;

    if (Number.isFinite(destinationLat) && Number.isFinite(destinationLng)) {
      destination = {
        latitude: destinationLat,
        longitude: destinationLng
      };
    } else {
      const address = [
        context.buyer_address,
        context.buyer_city,
        context.buyer_province,
        context.buyer_postal_code
      ];

      destination = address.some(part => part)
        ? await geocodeAddress(address)
        : null;
    }

    if (!destination) {
      return res.json({
        delivery_id: Number(deliveryId),
        status: 'unavailable',
        notice:
          'The delivery destination has no locatable coordinates, so a route cannot be calculated.'
      });
    }

    const routeUrl =
      `${OSRM_URL}/${originLng},${originLat};` +
      `${destination.longitude},${destination.latitude}` +
      '?overview=full&geometries=geojson';

    const routeResponse = await fetch(routeUrl, {
      headers: {
        'User-Agent': USER_AGENT
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!routeResponse.ok) {
      throw new Error('Routing service unavailable');
    }

    const routeBody = await routeResponse.json();

    const route = routeBody?.routes?.[0];

    if (!route || !route.geometry) {
      return res.json({
        delivery_id: Number(deliveryId),
        status: 'unavailable',
        notice:
          'A driving route could not be found between the pickup and delivery destination.'
      });
    }

    res.json({
      delivery_id: Number(deliveryId),
      status: 'ready',
      origin: {
        latitude: originLat,
        longitude: originLng
      },
      destination: {
        latitude: destination.latitude,
        longitude: destination.longitude
      },
      distance_m: route.distance,
      duration_s: route.duration,
      geometry: route.geometry
    });
  } catch (error) {
    console.error('Error calculating delivery route:', error.message);

    res.json({
      delivery_id: Number(deliveryId),
      status: 'error',
      notice: 'The route service could not be reached right now. Please try again.'
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