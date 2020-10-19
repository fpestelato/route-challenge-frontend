type GeoCodeStreetType = 'street_number' | 'neighborhood' | 'route' 
    | 'political' | 'postal_town' | 'administrative_area_level_1' | 'country' | 'postal_code' | 'sublocality' | string;

export interface ILatLng {
  latitude: number;
  longitude: number;
}

interface IGeoLatLng {
  lat: number;
  lng: number;
}

interface IGeoCodeAddressComponents {
    long_name: string;
    short_name: string;
    types: GeoCodeStreetType[];
}

interface IGeoCodeAddress {
    address_components: IGeoCodeAddressComponents[];
    formatted_address: string;
    geometry: {
      location: IGeoLatLng;
      location_type: string;
      viewport: {
        northeast: ILatLng;
        southwest: ILatLng;
      }
    },
    partial_match: boolean;
    place_id: string;
    plus_code?: {
      compound_code: string;
      global_code: string;
    },
    types: GeoCodeStreetType | string;
}

export type IGeoCodeStatusRespondeCodes = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';

export interface IGeoCodeResponse {
    status: IGeoCodeStatusRespondeCodes;
    results: IGeoCodeAddress[];
}