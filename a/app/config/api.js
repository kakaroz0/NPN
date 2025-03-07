// app/config/api.js
const API_BASE_URL = 'http://35.186.145.183:1337';

export const API_PATHS = {
  PACKAGES: `${API_BASE_URL}/api/packages`,
  USERS: `${API_BASE_URL}/api/users`,
  TRACKING: `${API_BASE_URL}/api/tracking`,
  AUTH_LOCAL: `${API_BASE_URL}/api/auth/local`,
  USER_ME: `${API_BASE_URL}/api/users/me`,
  PARCELS: `${API_BASE_URL}/api/parcels`, // เพิ่มสำหรับ parcels
};