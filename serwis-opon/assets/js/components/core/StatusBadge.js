/**
 * Komponent wyświetlający etykietę statusu
 * 
 * Używany do wyświetlania statusów rezerwacji, zamówień, itp.
 * w spójny sposób w całej aplikacji.
 */
const StatusBadge = ({ status, type = 'default' }) => {
  // Funkcja określająca klasę CSS na podstawie statusu i typu
  const getBadgeClass = () => {
    // Podstawowa klasa dla wszystkich etykiet
    let className = 'status-badge';
    
    // Klasa na podstawie typu etykiety
    switch (type) {
      case 'reservation':
        // Statusy rezerwacji
        switch (status) {
          case 'pending': return `${className} pending`;
          case 'confirmed': return `${className} confirmed`;
          case 'in_progress': return `${className} in-progress`;
          case 'completed': return `${className} completed`;
          case 'cancelled': return `${className} cancelled`;
          default: return `${className} pending`;
        }
      
      case 'order':
        // Statusy zamówień
        switch (status) {
          case 'pending': return `${className} pending`;
          case 'in_progress': return `${className} in-progress`;
          case 'completed': return `${className} completed`;
          case 'cancelled': return `${className} cancelled`;
          default: return `${className} pending`;
        }
      
      case 'payment':
        // Statusy płatności
        switch (status) {
          case 'paid': return `${className} completed`;
          case 'unpaid': return `${className} pending`;
          case 'partial': return `${className} in-progress`;
          case 'overdue': return `${className} cancelled`;
          default: return `${className} pending`;
        }
      
      case 'storage':
        // Statusy przechowalni
        switch (status) {
          case 'in_storage': return `${className} in-progress`;
          case 'picked_up': return `${className} completed`;
          case 'in_service': return `${className} pending`;
          default: return `${className} pending`;
        }
      
      case 'alert':
        // Typy alertów
        switch (status) {
          case 'info': return `${className} info`;
          case 'warning': return `${className} warning`;
          case 'error': return `${className} cancelled`;
          default: return `${className} info`;
        }
      
      default:
        // Domyślne mapowanie statusów
        switch (status) {
          case 'completed':
          case 'active':
          case 'success': return `${className} completed`;
          
          case 'in_progress':
          case 'in-progress':
          case 'processing': return `${className} in-progress`;
          
          case 'pending':
          case 'waiting': return `${className} pending`;
          
          case 'cancelled':
          case 'inactive':
          case 'error': return `${className} cancelled`;
          
          default: return `${className} default`;
        }
    }
  };
  
  // Funkcja określająca tekst etykiety na podstawie statusu i typu
  const getBadgeText = () => {
    // Konwersja statusu na przyjazną formę dla użytkownika
    switch (type) {
      case 'reservation':
        // Statusy rezerwacji po polsku
        switch (status) {
          case 'pending': return 'Oczekuje';
          case 'confirmed': return 'Potwierdzona';
          case 'in_progress': return 'W trakcie';
          case 'completed': return 'Zakończona';
          case 'cancelled': return 'Anulowana';
          default: return status;
        }
      
      case 'order':
        // Statusy zamówień po polsku
        switch (status) {
          case 'pending': return 'Oczekuje';
          case 'in_progress': return 'W realizacji';
          case 'completed': return 'Zrealizowane';
          case 'cancelled': return 'Anulowane';
          default: return status;
        }
      
      case 'payment':
        // Statusy płatności po polsku
        switch (status) {
          case 'paid': return 'Opłacone';
          case 'unpaid': return 'Nieopłacone';
          case 'partial': return 'Częściowa płatność';
          case 'overdue': return 'Zaległa płatność';
          default: return status;
        }
      
      case 'storage':
        // Statusy przechowalni po polsku
        switch (status) {
          case 'in_storage': return 'W przechowalni';
          case 'picked_up': return 'Odebrane';
          case 'in_service': return 'W serwisie';
          default: return status;
        }
      
      case 'alert':
        // Typy alertów po polsku
        switch (status) {
          case 'info': return 'Informacja';
          case 'warning': return 'Ostrzeżenie';
          case 'error': return 'Błąd';
          default: return status;
        }
      
      default:
        // Domyślne tłumaczenia
        switch (status) {
          case 'completed': return 'Zakończone';
          case 'active': return 'Aktywne';
          case 'success': return 'Sukces';
          
          case 'in_progress':
          case 'in-progress': return 'W trakcie';
          case 'processing': return 'Przetwarzanie';
          
          case 'pending': return 'Oczekuje';
          case 'waiting': return 'Oczekiwanie';
          
          case 'cancelled': return 'Anulowane';
          case 'inactive': return 'Nieaktywne';
          case 'error': return 'Błąd';
          
          default: return status;
        }
    }
  };
  
  // Renderowanie komponentu
  return React.createElement('span', { className: getBadgeClass() }, getBadgeText());
};