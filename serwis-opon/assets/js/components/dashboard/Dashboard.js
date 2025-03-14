/**
 * Komponent panelu głównego (dashboard)
 */
const Dashboard = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [todayReservations, setTodayReservations] = React.useState([]);
  const [dashboardStats, setDashboardStats] = React.useState({
    reservations: {
      today: 0,
      yesterday: 0,
      change: 0
    },
    storage: {
      tires: 0,
      capacity: 200,
      capacityPercentage: 0
    },
    clients: {
      total: 0,
      newThisMonth: 0
    },
    alerts: 0
  });

  // Pobieranie danych przy montowaniu komponentu
  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Pobierz dane statystyk (w rzeczywistej aplikacji użylibyśmy dashboardService)
        // Używamy tymczasowych danych, aby aplikacja działała bez backendu
        setTimeout(() => {
          // Symulacja danych z API
          const statsData = {
            reservations: {
              today: 8,
              yesterday: 6,
              change: 2
            },
            storage: {
              tires: 152,
              capacity: 200,
              capacityPercentage: 76
            },
            clients: {
              total: 287,
              newThisMonth: 14
            },
            alerts: 3
          };
          
          const reservationsData = [
            {
              id: 1,
              time: '08:00',
              client: 'Jan Kowalski',
              service: 'Wymiana opon (4 szt.)',
              status: 'completed'
            },
            {
              id: 2,
              time: '09:30',
              client: 'Anna Nowak',
              service: 'Przechowanie opon (4 szt.)',
              status: 'in_progress'
            },
            {
              id: 3,
              time: '11:00',
              client: 'Piotr Wiśniewski',
              service: 'Wymiana + wyważanie (4 szt.)',
              status: 'pending'
            },
            {
              id: 4,
              time: '13:30',
              client: 'Katarzyna Lewandowska',
              service: 'Naprawa opony',
              status: 'pending'
            },
            {
              id: 5,
              time: '15:00',
              client: 'Michał Kaczmarek',
              service: 'Odbiór opon z przechowalni',
              status: 'planned'
            }
          ];
          
          setDashboardStats(statsData);
          setTodayReservations(reservationsData);
          setLoading(false);
        }, 1000); // Symulacja opóźnienia sieciowego
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Nie udało się pobrać danych. Spróbuj odświeżyć stronę.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return React.createElement('span', { className: 'status-badge completed' }, 'Zakończona');
      case 'in_progress':
        return React.createElement('span', { className: 'status-badge in-progress' }, 'W trakcie');
      case 'pending':
        return React.createElement('span', { className: 'status-badge pending' }, 'Oczekuje');
      case 'cancelled':
        return React.createElement('span', { className: 'status-badge cancelled' }, 'Anulowana');
      default:
        return React.createElement('span', { className: 'status-badge planned' }, 'Zaplanowana');
    }
  };
  
  // Render podczas ładowania
  if (loading) {
    return React.createElement('div', { className: 'dashboard-loading' },
      React.createElement('div', { className: 'spinner' }),
      React.createElement('p', null, 'Ładowanie danych...')
    );
  }
  
  // Render w przypadku błędu
  if (error) {
    return React.createElement('div', { className: 'dashboard-error' },
      React.createElement('h2', null, 'Błąd'),
      React.createElement('p', null, error),
      React.createElement('button', { 
        onClick: () => window.location.reload(),
        className: 'btn-primary'
      }, 'Odśwież stronę')
    );
  }
  
  // Główny render
  return React.createElement('div', { className: 'dashboard-container' },
    // Nagłówek strony
    React.createElement('h1', { className: 'page-title' }, 'Panel główny'),
    React.createElement('p', { className: 'page-subtitle' }, 'Przegląd aktualnej działalności serwisu'),
    
    // Statystyki
    React.createElement('div', { className: 'statistics-grid' },
      // Karta rezerwacji
      React.createElement('div', { className: 'stat-card' },
        React.createElement('div', { className: 'stat-card-header' },
          React.createElement('h3', null, 'Dzisiejsze rezerwacje'),
          React.createElement('div', { className: 'stat-icon calendar' }, '📅')
        ),
        React.createElement('div', { className: 'stat-card-body' },
          React.createElement('div', { className: 'stat-number' }, dashboardStats.reservations.today)
        ),
        React.createElement('div', { className: 'stat-card-footer' },
          React.createElement('div', { className: 'stat-change positive' }, 
            '⬆️ +', dashboardStats.reservations.change, ' względem wczoraj'
          ),
          React.createElement('a', { href: '#/reservations', className: 'stat-link' }, 
            'Zobacz harmonogram 👁️'
          )
        )
      ),
      
      // Karta przechowalni
      React.createElement('div', { className: 'stat-card' },
        React.createElement('div', { className: 'stat-card-header' },
          React.createElement('h3', null, 'Opony w przechowalni'),
          React.createElement('div', { className: 'stat-icon warehouse' }, '🏢')
        ),
        React.createElement('div', { className: 'stat-card-body' },
          React.createElement('div', { className: 'stat-number' }, dashboardStats.storage.tires)
        ),
        React.createElement('div', { className: 'stat-card-footer' },
          React.createElement('div', { className: 'stat-info' }, 
            dashboardStats.storage.capacityPercentage, '% pojemności magazynu'
          ),
          React.createElement('a', { href: '#/storage', className: 'stat-link' }, 
            'Zarządzaj przechowalnią 👁️'
          )
        )
      ),
      
      // Karta klientów
      React.createElement('div', { className: 'stat-card' },
        React.createElement('div', { className: 'stat-card-header' },
          React.createElement('h3', null, 'Klientów w bazie'),
          React.createElement('div', { className: 'stat-icon clients' }, '👥')
        ),
        React.createElement('div', { className: 'stat-card-body' },
          React.createElement('div', { className: 'stat-number' }, dashboardStats.clients.total)
        ),
        React.createElement('div', { className: 'stat-card-footer' },
          React.createElement('div', { className: 'stat-change positive' }, 
            '⬆️ +', dashboardStats.clients.newThisMonth, ' w tym miesiącu'
          ),
          React.createElement('a', { href: '#/clients', className: 'stat-link' }, 
            'Baza klientów 👁️'
          )
        )
      ),
      
      // Karta alertów
      React.createElement('div', { className: 'stat-card' },
        React.createElement('div', { className: 'stat-card-header' },
          React.createElement('h3', null, 'Alerty'),
          React.createElement('div', { className: 'stat-icon alerts' }, '⚠️')
        ),
        React.createElement('div', { className: 'stat-card-body' },
          React.createElement('div', { className: 'stat-number' }, dashboardStats.alerts)
        ),
        React.createElement('div', { className: 'stat-card-footer' },
          React.createElement('div', { className: 'stat-alert' }, 
            dashboardStats.alerts > 0 ? 'Wymaga uwagi!' : 'Brak alertów'
          ),
          React.createElement('a', { href: '#/alerts', className: 'stat-link' }, 
            'Sprawdź alerty 👁️'
          )
        )
      )
    ),
    
    // Sekcja dzisiejszych rezerwacji
    React.createElement('div', { className: 'dashboard-section' },
      // Nagłówek sekcji
      React.createElement('div', { className: 'section-header' },
        React.createElement('h2', null, 'Dzisiejsze rezerwacje'),
        React.createElement('button', { className: 'btn-primary' },
          '➕ Nowa rezerwacja'
        )
      ),
      
      // Tabela rezerwacji
      React.createElement('div', { className: 'table-responsive' },
        React.createElement('table', { className: 'data-table' },
          // Nagłówek tabeli
          React.createElement('thead', null,
            React.createElement('tr', null,
              React.createElement('th', null, 'Czas'),
              React.createElement('th', null, 'Klient'),
              React.createElement('th', null, 'Usługa'),
              React.createElement('th', null, 'Status'),
              React.createElement('th', null, 'Akcje')
            )
          ),
          // Ciało tabeli
          React.createElement('tbody', null,
            todayReservations.map(reservation => 
              React.createElement('tr', { key: reservation.id },
                React.createElement('td', null, reservation.time),
                React.createElement('td', null, reservation.client),
                React.createElement('td', null, reservation.service),
                React.createElement('td', null, getStatusLabel(reservation.status)),
                React.createElement('td', { className: 'actions-cell' },
                  React.createElement('button', { className: 'btn-icon', title: 'Zobacz szczegóły' }, '👁️'),
                  React.createElement('button', { className: 'btn-icon', title: 'Edytuj' }, '✏️'),
                  React.createElement('button', { className: 'btn-icon', title: 'Drukuj' }, '🖨️')
                )
              )
            )
          )
        )
      ),
      
      // Stopka sekcji
      React.createElement('div', { className: 'section-footer' },
        React.createElement('a', { href: '#/reservations', className: 'link-all' },
          'Zobacz wszystkie rezerwacje'
        )
      )
    ),
    
    // Sekcja szybkich akcji
    React.createElement('div', { className: 'quick-actions-section' },
      React.createElement('h2', null, 'Szybkie akcje'),
      
      React.createElement('div', { className: 'quick-actions-grid' },
        // Akcja 1: Nowa rezerwacja
        React.createElement('a', { href: '#/reservations/new', className: 'quick-action-card' },
          React.createElement('div', { className: 'quick-action-icon' }, '📅'),
          React.createElement('div', { className: 'quick-action-label' }, 'Nowa rezerwacja')
        ),
        
        // Akcja 2: Nowy klient
        React.createElement('a', { href: '#/clients/new', className: 'quick-action-card' },
          React.createElement('div', { className: 'quick-action-icon' }, '👤'),
          React.createElement('div', { className: 'quick-action-label' }, 'Nowy klient')
        ),
        
        // Akcja 3: Nowa faktura
        React.createElement('a', { href: '#/invoices/new', className: 'quick-action-card' },
          React.createElement('div', { className: 'quick-action-icon' }, '📄'),
          React.createElement('div', { className: 'quick-action-label' }, 'Nowa faktura')
        ),
        
        // Akcja 4: Znajdź opony
        React.createElement('a', { href: '#/storage/find', className: 'quick-action-card' },
          React.createElement('div', { className: 'quick-action-icon' }, '🔍'),
          React.createElement('div', { className: 'quick-action-label' }, 'Znajdź opony')
        ),
        
        // Akcja 5: Dodaj dostawę
        React.createElement('a', { href: '#/storage/delivery', className: 'quick-action-card' },
          React.createElement('div', { className: 'quick-action-icon' }, '🚚'),
          React.createElement('div', { className: 'quick-action-label' }, 'Dodaj dostawę')
        ),
        
        // Akcja 6: Drukuj etykietę
        React.createElement('a', { href: '#/services/new', className: 'quick-action-card' },
          React.createElement('div', { className: 'quick-action-icon' }, '🏷️'),
          React.createElement('div', { className: 'quick-action-label' }, 'Drukuj etykietę')
        )
      )
    )
  );
};