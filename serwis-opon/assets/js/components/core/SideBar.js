/**
 * Komponent menu bocznego (SideBar)
 */
// Import modułu klientów
import { inicjalizujModulKlientow } from '../clients/ClientsModule.js';

const SideBar = ({ collapsed, toggleSidebar }) => {
  // Aktualnie aktywny moduł
  const [activeModule, setActiveModule] = React.useState('dashboard');
  
  // Funkcja ustalająca, czy dany moduł jest aktywny
  const isActive = (module) => activeModule === module;
  
  // Obsługa kliknięcia w link
  const handleLinkClick = (module) => {
    setActiveModule(module);
    
    // Inicjalizacja modułu klientów, jeśli został wybrany
    if (module === 'clients') {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = '';
        
        const klienciKontener = document.createElement('div');
        klienciKontener.className = 'klienci-kontener';
        mainContent.appendChild(klienciKontener);
        
        // Inicjalizacja modułu klientów
        inicjalizujModulKlientow();
      }
    }
  };
  
  return React.createElement('aside', { className: 'sidebar' },
    // Nagłówek menu
    React.createElement('div', { className: 'sidebar-header' },
      React.createElement('h1', null, 
        React.createElement('span', null, '🔧'),
        React.createElement('span', null, 'Serwis Opon')
      ),
      React.createElement('button', { 
        className: 'sidebar-toggle',
        onClick: toggleSidebar
      }, collapsed ? '→' : '←')
    ),
    
    // Nawigacja
    React.createElement('nav', { className: 'sidebar-nav' },
      // Panel główny
      React.createElement('a', { 
        href: '#/',
        className: isActive('dashboard') ? 'active' : '',
        onClick: () => handleLinkClick('dashboard')
      },
        React.createElement('span', { className: 'icon-spacing' }, '📊'),
        React.createElement('span', null, 'Panel główny')
      ),
      
      // Rezerwacje
      React.createElement('a', { 
        href: '#/reservations',
        className: isActive('reservations') ? 'active' : '',
        onClick: () => handleLinkClick('reservations')
      },
        React.createElement('span', { className: 'icon-spacing' }, '📅'),
        React.createElement('span', null, 'Rezerwacje')
      ),
      
      // Przechowalnia
      React.createElement('a', { 
        href: '#/storage',
        className: isActive('storage') ? 'active' : '',
        onClick: () => handleLinkClick('storage')
      },
        React.createElement('span', { className: 'icon-spacing' }, '🏢'),
        React.createElement('span', null, 'Przechowalnia')
      ),
      
      // Klienci - Zaktualizowany do integracji z modułem klientów
      React.createElement('a', { 
        href: '#/clients',
        className: isActive('clients') ? 'active' : '',
        onClick: () => handleLinkClick('clients'),
        id: 'menu-klienci'
      },
        React.createElement('span', { className: 'icon-spacing' }, '👥'),
        React.createElement('span', null, 'Klienci')
      ),
      
      // Magazyn
      React.createElement('a', { 
        href: '#/inventory',
        className: isActive('inventory') ? 'active' : '',
        onClick: () => handleLinkClick('inventory')
      },
        React.createElement('span', { className: 'icon-spacing' }, '📦'),
        React.createElement('span', null, 'Magazyn')
      ),
      
      // Zamówienia
      React.createElement('a', { 
        href: '#/orders',
        className: isActive('orders') ? 'active' : '',
        onClick: () => handleLinkClick('orders')
      },
        React.createElement('span', { className: 'icon-spacing' }, '📋'),
        React.createElement('span', null, 'Zamówienia')
      ),
      
      // Pracownicy
      React.createElement('a', { 
        href: '#/employees',
        className: isActive('employees') ? 'active' : '',
        onClick: () => handleLinkClick('employees')
      },
        React.createElement('span', { className: 'icon-spacing' }, '👨‍💼'),
        React.createElement('span', null, 'Pracownicy')
      ),
      
      // Finanse
      React.createElement('a', { 
        href: '#/finance',
        className: isActive('finance') ? 'active' : '',
        onClick: () => handleLinkClick('finance')
      },
        React.createElement('span', { className: 'icon-spacing' }, '💰'),
        React.createElement('span', null, 'Finanse')
      ),
      
      // Ustawienia
      React.createElement('a', { 
        href: '#/settings',
        className: isActive('settings') ? 'active' : '',
        onClick: () => handleLinkClick('settings')
      },
        React.createElement('span', { className: 'icon-spacing' }, '⚙️'),
        React.createElement('span', null, 'Ustawienia')
      )
    ),
    
    // Stopka menu
    React.createElement('div', { className: 'sidebar-footer' },
      React.createElement('div', { className: 'version' }, 'Wersja 1.0.1'),
      React.createElement('div', { className: 'copyright' }, 'MATEO Serwis Opon Systems © 2025')
    )
  );
};