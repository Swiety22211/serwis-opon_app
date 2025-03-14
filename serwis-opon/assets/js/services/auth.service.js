/**
 * Serwis uwierzytelniania
 * 
 * Obsługuje logowanie, wylogowywanie i zarządzanie tokenem użytkownika
 */
class AuthService extends ApiService {
  constructor() {
    super();
  }
  
  /**
   * Sprawdza, czy użytkownik jest zalogowany
   * @returns {boolean} - Status zalogowania
   */
  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  
  /**
   * Pobiera dane zalogowanego użytkownika
   * @returns {Object|null} - Dane użytkownika lub null jeśli nie jest zalogowany
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  
  /**
   * Loguje użytkownika
   * @param {string} username - Nazwa użytkownika
   * @param {string} password - Hasło
   * @returns {Promise} - Promise z danymi użytkownika
   */
  async login(username, password) {
    try {
      const response = await this.post(API_CONFIG.AUTH.LOGIN, { username, password });
      
      if (response.data && response.data.token) {
        // Zapisz token w localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Wylogowuje użytkownika
   * @returns {void}
   */
  logout() {
    // W prawdziwej aplikacji moglibyśmy wywołać API, aby unieważnić token
    // this.post(API_CONFIG.AUTH.LOGOUT);
    
    // Usuń dane z localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    // Przekieruj do strony logowania
    window.location.hash = '#/login';
  }
  
  /**
   * Odświeża token użytkownika
   * @returns {Promise} - Promise z nowym tokenem
   */
  async refreshToken() {
    try {
      const response = await this.post(API_CONFIG.AUTH.REFRESH);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  }
}

// Tworzenie i eksport instancji serwisu
const authService = new AuthService();
// export default authService;