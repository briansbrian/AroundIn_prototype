
import { useState } from 'react';
import type { GeoLocation } from '../types';

interface GeolocationState {
  location: GeoLocation | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  // Do NOT request browser location to avoid permission prompt
  const [state] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
  });

  return state;
};
