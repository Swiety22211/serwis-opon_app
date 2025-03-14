/**
 * Konfiguracja API dla aplikacji Serwis Opon
 */

const API_CONFIG = {
  // Podstawowy URL do API
  BASE_URL: 'http://localhost/serwis-opon/api',
  
  // Timeout dla zapytań (w ms)
  TIMEOUT: 30000,
  
  // Domyślne nagłówki dla wszystkich zapytań
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Endpoint uwierzytelniania
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  
  // Endpoint panelu głównego
  DASHBOARD: {
    STATS: '/dashboard/stats',
    TODAY_RESERVATIONS: '/dashboard/today-reservations'
  },
  
  // Endpointy rezerwacji
  RESERVATIONS: {
    BASE: '/reservations',
    BY_DATE: '/reservations/date'
  },
  
  // Endpointy klientów
  CLIENTS: {
    BASE: '/clients',
    SEARCH: '/clients/search'
  },
  
  // Endpointy przechowalni
  STORAGE: {
    BASE: '/storage',
    BY_CLIENT: '/storage/client'
  },
  
  // Endpointy magazynu
  INVENTORY: {
    BASE: '/inventory',
    CATEGORIES: '/inventory/categories'
  },
  
  // Endpointy zamówień
  ORDERS: {
    BASE: '/orders',
    BY_CLIENT: '/orders/client'
  },
  
  // Endpointy pracowników
  EMPLOYEES: {
    BASE: '/employees'
  },
  
  // Endpointy finansów
  FINANCE: {
    BASE: '/finance',
    INVOICES: '/finance/invoices'
  },
  
  // Endpointy ustawień
  SETTINGS: {
    BASE: '/settings',
    COMPANY: '/settings/company',
    SYSTEM: '/settings/system'
  }
};