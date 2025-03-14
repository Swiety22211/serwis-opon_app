/**
 * Komponent ustawień aplikacji
 */
const Settings = () => {
  // Stan formularzy ustawień
  const [generalSettings, setGeneralSettings] = React.useState({
    companyName: 'Serwis Opon',
    address: 'ul. Przykładowa 123',
    postalCode: '00-000',
    city: 'Warszawa',
    nip: '1234567890',
    email: 'kontakt@serwisopon.pl',
    phone: '123 456 789',
    website: 'www.serwisopon.pl',
  });
  
  const [userSettings, setUserSettings] = React.useState({
    username: 'admin',
    password: '',
    confirmPassword: '',
    email: 'admin@serwisopon.pl',
    notifications: true,
  });
  
  const [systemSettings, setSystemSettings] = React.useState({
    autoBackup: true,
    backupInterval: 'daily',
    backupLocation: 'local',
    language: 'pl',
    theme: 'light',
    currency: 'PLN',
    vatRate: '23',
  });
  
  // Aktywna zakładka
  const [activeTab, setActiveTab] = React.useState('general');
  
  // Stan zapisywania
  const [isSaved, setIsSaved] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Obsługa zmiany ustawień ogólnych
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
    setIsSaved(false);
  };
  
  // Obsługa zmiany ustawień użytkownika
  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserSettings({
      ...userSettings,
      [name]: type === 'checkbox' ? checked : value,
    });
    setIsSaved(false);
  };
  
  // Obsługa zmiany ustawień systemowych
  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemSettings({
      ...systemSettings,
      [name]: type === 'checkbox' ? checked : value,
    });
    setIsSaved(false);
  };
  
  // Obsługa zapisywania ustawień
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Symulacja zapisywania do API (w rzeczywistej aplikacji połączymy się z API)
    setTimeout(() => {
      console.log('General settings:', generalSettings);
      console.log('User settings:', userSettings);
      console.log('System settings:', systemSettings);
      
      setIsSaving(false);
      setIsSaved(true);
      
      // Ukryj komunikat po 3 sekundach
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 1000);
  };
  
  return React.createElement('div', { className: 'settings-container' },
    // Nagłówek
    React.createElement('h1', null, 
      React.createElement('span', { className: 'icon-spacing' }, '⚙️'),
      'Ustawienia'
    ),
    
    // Zakładki
    React.createElement('div', { className: 'settings-tabs' },
      React.createElement('button', { 
        className: activeTab === 'general' ? 'active' : '',
        onClick: () => setActiveTab('general')
      },
        React.createElement('span', { className: 'icon-spacing' }, '🏢'),
        'Firma'
      ),
      
      React.createElement('button', { 
        className: activeTab === 'user' ? 'active' : '',
        onClick: () => setActiveTab('user')
      },
        React.createElement('span', { className: 'icon-spacing' }, '👤'),
        'Użytkownik'
      ),
      
      React.createElement('button', { 
        className: activeTab === 'system' ? 'active' : '',
        onClick: () => setActiveTab('system')
      },
        React.createElement('span', { className: 'icon-spacing' }, '⚙️'),
        'System'
      )
    ),
    
    // Zawartość zakładek
    React.createElement('div', { className: 'settings-content' },
      // Zakładka ustawień firmy
      activeTab === 'general' && React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('h2', null, 'Ustawienia firmy'),
        
        // Nazwa firmy
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'companyName' }, 'Nazwa firmy'),
          React.createElement('input', {
            type: 'text',
            id: 'companyName',
            name: 'companyName',
            value: generalSettings.companyName,
            onChange: handleGeneralChange,
            required: true
          })
        ),
        
        // Adres
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'address' }, 'Adres'),
          React.createElement('input', {
            type: 'text',
            id: 'address',
            name: 'address',
            value: generalSettings.address,
            onChange: handleGeneralChange
          })
        ),
        
        // Kod pocztowy i miasto
        React.createElement('div', { className: 'form-row' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { htmlFor: 'postalCode' }, 'Kod pocztowy'),
            React.createElement('input', {
              type: 'text',
              id: 'postalCode',
              name: 'postalCode',
              value: generalSettings.postalCode,
              onChange: handleGeneralChange
            })
          ),
          
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { htmlFor: 'city' }, 'Miasto'),
            React.createElement('input', {
              type: 'text',
              id: 'city',
              name: 'city',
              value: generalSettings.city,
              onChange: handleGeneralChange
            })
          )
        ),
        
        // NIP
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'nip' }, 'NIP'),
          React.createElement('input', {
            type: 'text',
            id: 'nip',
            name: 'nip',
            value: generalSettings.nip,
            onChange: handleGeneralChange
          })
        ),
        
        // Email i telefon
        React.createElement('div', { className: 'form-row' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { htmlFor: 'email' }, 'Email'),
            React.createElement('input', {
              type: 'email',
              id: 'email',
              name: 'email',
              value: generalSettings.email,
              onChange: handleGeneralChange
            })
          ),
          
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { htmlFor: 'phone' }, 'Telefon'),
            React.createElement('input', {
              type: 'tel',
              id: 'phone',
              name: 'phone',
              value: generalSettings.phone,
              onChange: handleGeneralChange
            })
          )
        ),
        
        // Strona internetowa
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'website' }, 'Strona internetowa'),
          React.createElement('input', {
            type: 'text',
            id: 'website',
            name: 'website',
            value: generalSettings.website,
            onChange: handleGeneralChange
          })
        ),
        
        // Przycisk zapisz
        React.createElement('button', { 
          type: 'submit',
          className: 'btn-save',
          disabled: isSaving
        }, isSaving ? 'Zapisywanie...' : 'Zapisz zmiany')
      ),
      
      // Zakładka ustawień użytkownika
      activeTab === 'user' && React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('h2', null, 'Ustawienia użytkownika'),
        
        // Nazwa użytkownika
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'username' }, 'Nazwa użytkownika'),
          React.createElement('input', {
            type: 'text',
            id: 'username',
            name: 'username',
            value: userSettings.username,
            onChange: handleUserChange,
            required: true
          })
        ),
        
        // Hasło
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'password' }, 'Hasło'),
          React.createElement('input', {
            type: 'password',
            id: 'password',
            name: 'password',
            value: userSettings.password,
            onChange: handleUserChange,
            placeholder: 'Wpisz nowe hasło...'
          })
        ),
        
        // Potwierdzenie hasła
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'confirmPassword' }, 'Potwierdź hasło'),
          React.createElement('input', {
            type: 'password',
            id: 'confirmPassword',
            name: 'confirmPassword',
            value: userSettings.confirmPassword,
            onChange: handleUserChange,
            placeholder: 'Potwierdź nowe hasło...'
          })
        ),
        
        // Email
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'userEmail' }, 'Email'),
          React.createElement('input', {
            type: 'email',
            id: 'userEmail',
            name: 'email',
            value: userSettings.email,
            onChange: handleUserChange,
            required: true
          })
        ),
        
        // Powiadomienia
        React.createElement('div', { className: 'form-group checkbox-group' },
          React.createElement('input', {
            type: 'checkbox',
            id: 'notifications',
            name: 'notifications',
            checked: userSettings.notifications,
            onChange: handleUserChange
          }),
          React.createElement('label', { htmlFor: 'notifications' }, 'Powiadomienia email')
        ),
        
        // Przycisk zapisz
        React.createElement('button', { 
          type: 'submit',
          className: 'btn-save',
          disabled: isSaving
        }, isSaving ? 'Zapisywanie...' : 'Zapisz zmiany')
      ),
      
      // Zakładka ustawień systemowych
      activeTab === 'system' && React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('h2', null, 'Ustawienia systemu'),
        
        // Sekcja backup
        React.createElement('div', { className: 'section-title' },
          React.createElement('span', { className: 'icon-spacing' }, '💾'),
          'Backup'
        ),
        
        // Automatyczny backup
        React.createElement('div', { className: 'form-group checkbox-group' },
          React.createElement('input', {
            type: 'checkbox',
            id: 'autoBackup',
            name: 'autoBackup',
            checked: systemSettings.autoBackup,
            onChange: handleSystemChange
          }),
          React.createElement('label', { htmlFor: 'autoBackup' }, 'Automatyczny backup')
        ),
        
        // Częstotliwość backupu
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'backupInterval' }, 'Częstotliwość backupu'),
          React.createElement('select', {
            id: 'backupInterval',
            name: 'backupInterval',
            value: systemSettings.backupInterval,
            onChange: handleSystemChange,
            disabled: !systemSettings.autoBackup
          },
            React.createElement('option', { value: 'daily' }, 'Codziennie'),
            React.createElement('option', { value: 'weekly' }, 'Co tydzień'),
            React.createElement('option', { value: 'monthly' }, 'Co miesiąc')
          )
        ),
        
        // Lokalizacja backupu
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'backupLocation' }, 'Lokalizacja backupu'),
          React.createElement('select', {
            id: 'backupLocation',
            name: 'backupLocation',
            value: systemSettings.backupLocation,
            onChange: handleSystemChange
          },
            React.createElement('option', { value: 'local' }, 'Lokalnie'),
            React.createElement('option', { value: 'cloud' }, 'Chmura')
          )
        ),
        
        // Przycisk wykonania backupu
        React.createElement('div', { className: 'form-group' },
          React.createElement('button', {
            type: 'button',
            className: 'btn-secondary'
          },
            React.createElement('span', { className: 'icon-spacing' }, '⬆️'),
            'Wykonaj backup teraz'
          )
        ),
        
        // Sekcja ogólne
        React.createElement('div', { className: 'section-title' },
          React.createElement('span', { className: 'icon-spacing' }, '⚙️'),
          'Ogólne'
        ),
        
        // Język
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'language' }, 'Język'),
          React.createElement('select', {
            id: 'language',
            name: 'language',
            value: systemSettings.language,
            onChange: handleSystemChange
          },
            React.createElement('option', { value: 'pl' }, 'Polski'),
            React.createElement('option', { value: 'en' }, 'English'),
            React.createElement('option', { value: 'de' }, 'Deutsch')
          )
        ),
        
        // Motyw
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'theme' }, 'Motyw'),
          React.createElement('select', {
            id: 'theme',
            name: 'theme',
            value: systemSettings.theme,
            onChange: handleSystemChange
          },
            React.createElement('option', { value: 'light' }, 'Jasny'),
            React.createElement('option', { value: 'dark' }, 'Ciemny')
          )
        ),
        
        // Sekcja faktury
        React.createElement('div', { className: 'section-title' },
          React.createElement('span', { className: 'icon-spacing' }, '📄'),
          'Faktury'
        ),
        
        // Waluta
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'currency' }, 'Waluta'),
          React.createElement('select', {
            id: 'currency',
            name: 'currency',
            value: systemSettings.currency,
            onChange: handleSystemChange
          },
            React.createElement('option', { value: 'PLN' }, 'PLN'),
            React.createElement('option', { value: 'EUR' }, 'EUR'),
            React.createElement('option', { value: 'USD' }, 'USD')
          )
        ),
        
        // Stawka VAT
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'vatRate' }, 'Domyślna stawka VAT (%)'),
          React.createElement('input', {
            type: 'number',
            id: 'vatRate',
            name: 'vatRate',
            value: systemSettings.vatRate,
            onChange: handleSystemChange,
            min: '0',
            max: '100'
          })
        ),
        
        // Przycisk zapisz
        React.createElement('button', { 
          type: 'submit',
          className: 'btn-save',
          disabled: isSaving
        }, isSaving ? 'Zapisywanie...' : 'Zapisz zmiany')
      ),
      
      // Komunikat o zapisaniu
      isSaved && React.createElement('div', { className: 'save-success' },
        'Zmiany zostały zapisane pomyślnie!'
      )
    )
  );
};