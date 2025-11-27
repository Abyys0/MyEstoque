// Firebase configuration
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// API configuration
export const API_URL = 'http://localhost:3000/api';

// Socket.io configuration
export const SOCKET_URL = 'http://localhost:3000';

// App configuration
export const APP_CONFIG = {
  lowStockThreshold: 10,
  expiryWarningDays: 30,
  enablePushNotifications: true,
  darkMode: 'auto', // 'auto', 'light', 'dark'
};
