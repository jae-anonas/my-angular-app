import { environment } from '../../environments/environment';

const domain = environment.apiUrl;

export const API_ENDPOINTS = {
  BASE_URL: domain + '/api/',
  FILMS: domain + '/api/films/',
  USERS: domain + '/api/users',
  CATEGORIES: domain + '/api/categories/options',
  LANGUAGES: domain + '/api/languages/options',
  STORES: domain + '/api/stores/options',
  INVENTORY: domain + '/api/inventory/',
  RENTALS: domain + '/api/rentals/'
} as const;
// export const API_ENDPOINTS = {
//   BASE_URL: '/api',
//   FILMS: '/api/films/',
//   USERS: '/api/users',
//   CATEGORIES: '/api/categories/options',
//   LANGUAGES: '/api/languages/options'
// } as const;