import { Shop, Product, GeoLocation } from '../types';
import { MOCK_SHOPS } from '../constants';

// Haversine formula to calculate distance between two points
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Convert to meters
}

// Format distance in meters or kilometers
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}

// Search result types
export interface LocalSearchResult {
  type: 'shop' | 'product';
  shop: Shop;
  product?: Product;
  distance: number;
  formattedDistance: string;
  relevanceScore: number;
}

export interface SearchResults {
  localResults: LocalSearchResult[];
  hasExternalResults: boolean;
}

// Search through local shops and products
export function searchLocalData(query: string, userLocation?: GeoLocation): LocalSearchResult[] {
  const results: LocalSearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  MOCK_SHOPS.forEach(shop => {
    let shopRelevance = 0;
    let shopDistance = 0;

    // Calculate distance if user location is available
    if (userLocation) {
      shopDistance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        shop.location.latitude,
        shop.location.longitude
      );
    }

    // Check shop name match
    if (shop.name.toLowerCase().includes(lowerQuery)) {
      shopRelevance += 10;
    }

    // Check shop category match
    if (shop.category.toLowerCase().includes(lowerQuery)) {
      shopRelevance += 5;
    }

    // Check products
    shop.products.forEach(product => {
      let productRelevance = 0;

      // Check product name match
      if (product.name.toLowerCase().includes(lowerQuery)) {
        productRelevance += 8;
      }

      // Check product category match
      if (product.category.toLowerCase().includes(lowerQuery)) {
        productRelevance += 4;
      }

      // If product matches, add it to results
      if (productRelevance > 0) {
        results.push({
          type: 'product',
          shop,
          product,
          distance: shopDistance,
          formattedDistance: userLocation ? formatDistance(shopDistance) : shop.distance,
          relevanceScore: productRelevance
        });
      }
    });

    // If shop itself matches (but not through products), add shop result
    if (shopRelevance > 0 && !shop.products.some(p =>
      p.name.toLowerCase().includes(lowerQuery) || p.category.toLowerCase().includes(lowerQuery)
    )) {
      results.push({
        type: 'shop',
        shop,
        distance: shopDistance,
        formattedDistance: userLocation ? formatDistance(shopDistance) : shop.distance,
        relevanceScore: shopRelevance
      });
    }
  });

  // Sort by relevance score (highest first)
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}