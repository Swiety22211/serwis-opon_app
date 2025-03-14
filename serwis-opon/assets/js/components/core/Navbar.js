/**
 * Komponent paska nawigacyjnego (NavBar)
 */
const NavBar = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [notifications, setNotifications] = React.useState(3);
  const [user, setUser] = React.useState({
    name: 'Adam Nowak',
    initials: 'AN'
  });
  
  // Obsługa zmiany zapytania wyszukiwania
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Obsługa zatwierdzenia wyszukiwania
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Logika wyszukiwania...
    console.log('Searching for:', searchQuery);
  };
  
  // Obsługa kliknięcia ikony powiadomień
  const handleNotificationsClick = () => {
    // Logika obsługi powiadomień...
    console.log('Notifications clicked');
  };
  
  // Obsługa kliknięcia profilu użytkownika
  const handleProfileClick = () => {
    // Logika obsługi profilu...
    console.log('Profile clicked');
  };
  
  return React.createElement('header', { className: 'top-navbar' },
    // Przycisk przełączania menu (tylko na mobilnych urządzeniach)
    React.createElement('button', { 
      className: 'sidebar-toggle mobile-only',
      onClick: toggleSidebar 
    }, '☰'),
    
    // Pole wyszukiwania
    React.createElement('form', { 
      className: 'search-box',
      onSubmit: handleSearchSubmit
    },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Szukaj klienta, opony, rezerwacji...',
        value: searchQuery,
        onChange: handleSearchChange
      }),
      React.createElement('div', { className: 'search-icon' }, '🔍')
    ),
    
    // Prawa część paska nawigacyjnego
    React.createElement('div', { className: 'navbar-right' },
      // Ikona powiadomień
      React.createElement('div', { 
        className: 'notification-icon',
        onClick: handleNotificationsClick
      },
        React.createElement('span', null, '🔔'),
        notifications > 0 && React.createElement('span', { 
          className: 'notification-badge' 
        }, notifications)
      ),
      
      // Profil użytkownika
      React.createElement('div', { 
        className: 'user-profile',
        onClick: handleProfileClick
      },
        React.createElement('span', { className: 'user-name' }, user.name),
        React.createElement('div', { className: 'avatar' }, user.initials)
      )
    )
  );
};