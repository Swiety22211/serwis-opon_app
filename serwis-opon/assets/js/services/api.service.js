/**
 * Bazowa klasa serwisu API do komunikacji z backendem
 */
class ApiService {
  constructor() {
    this.axios = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS
    });
    
    // Dodaj interceptor dla dodawania tokena autoryzacyjnego
    this.axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    
    // Dodaj interceptor dla obsługi błędów
    this.axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        // Obsługa błędu 401 (nieuprawniony) - przekierowanie do logowania
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Wykonuje zapytanie GET
   * @param {string} url - Endpoint API
   * @param {Object} params - Parametry zapytania
   * @returns {Promise} - Promise z odpowiedzią
   */
  async get(url, params = {}) {
    try {
      return await this.axios.get(url, { params });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /**
   * Wykonuje zapytanie POST
   * @param {string} url - Endpoint API
   * @param {Object} data - Dane do wysłania
   * @returns {Promise} - Promise z odpowiedzią
   */
  async post(url, data = {}) {
    try {
      return await this.axios.post(url, data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /**
   * Wykonuje zapytanie PUT
   * @param {string} url - Endpoint API
   * @param {Object} data - Dane do wysłania
   * @returns {Promise} - Promise z odpowiedzią
   */
  async put(url, data = {}) {
    try {
      return await this.axios.put(url, data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /**
   * Wykonuje zapytanie DELETE
   * @param {string} url - Endpoint API
   * @returns {Promise} - Promise z odpowiedzią
   */
  async delete(url) {
    try {
      return await this.axios.delete(url);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /**
   * Obsługuje błędy zapytań HTTP
   * @param {Object} error - Obiekt błędu
   */
  handleError(error) {
    if (error.response) {
      // Odpowiedź z serwera z kodem błędu
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Nie otrzymano odpowiedzi
      console.error('API Request Error:', error.request);
    } else {
      // Błąd podczas tworzenia zapytania
      console.error('API Config Error:', error.message);
    }
  }
}

// Eksport klasy
// export default ApiService;