/**
 * Serwis dla panelu głównego (dashboard)
 */
class DashboardService extends ApiService {
  constructor() {
    super();
  }
  
  /**
   * Pobiera statystyki dla panelu głównego
   * @returns {Promise} - Promise z danymi statystyk
   */
  async getStats() {
    try {
      const response = await this.get(API_CONFIG.DASHBOARD.STATS);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
  
  /**
   * Pobiera dzisiejsze rezerwacje dla panelu głównego
   * @returns {Promise} - Promise z listą rezerwacji
   */
  async getTodayReservations() {
    try {
      const response = await this.get(API_CONFIG.DASHBOARD.TODAY_RESERVATIONS);
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s reservations:', error);
      throw error;
    }
  }
  
  /**
   * Pobiera aktywne alerty dla panelu głównego
   * @returns {Promise} - Promise z listą alertów
   */
  async getAlerts() {
    try {
      const response = await this.get('/alerts/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  }
}

// Tworzenie i eksport instancji serwisu
const dashboardService = new DashboardService();
// export default dashboardService;