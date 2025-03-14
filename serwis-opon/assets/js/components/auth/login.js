/**
 * Komponent logowania
 * 
 * Wyświetla formularz logowania i obsługuje uwierzytelnianie użytkownika
 */
const Login = () => {
  // Stan formularza logowania
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Obsługa zmiany username
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (error) setError(''); // Czyść błąd przy zmianie
  };
  
  // Obsługa zmiany hasła
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(''); // Czyść błąd przy zmianie
  };
  
  // Obsługa wysłania formularza
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Sprawdź, czy pola są wypełnione
    if (!username.trim() || !password.trim()) {
      setError('Wprowadź nazwę użytkownika i hasło');
      return;
    }
    
    // Rozpocznij proces logowania
    setIsLoading(true);
    setError('');
    
    // W rzeczywistej aplikacji tutaj byłoby wywołanie API
    // Użyjemy prostego opóźnienia, aby zasymulować żądanie API
    setTimeout(() => {
      // Dla demonstracji - tylko admin/admin123 jest poprawny
      if (username === 'admin' && password === 'admin123') {
        // Zapisz informacje o zalogowanym użytkowniku (w rzeczywistej aplikacji - token JWT)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          username: 'admin',
          name: 'Adam Nowak',
          role: 'admin'
        }));
        
        // Przekieruj do strony głównej
        window.location.hash = '#/';
      } else {
        // Pokaż błąd logowania
        setError('Nieprawidłowa nazwa użytkownika lub hasło');
        setIsLoading(false);
      }
    }, 1000);
  };
  
  return React.createElement('div', { className: 'login-container' },
    React.createElement('div', { className: 'login-form' },
      // Logo
      React.createElement('div', { className: 'login-logo' }, '🛞'),
      
      // Tytuł
      React.createElement('h1', { className: 'login-title' }, 'Serwis Opon'),
      
      // Komunikat błędu
      error && React.createElement('div', { className: 'login-error' }, error),
      
      // Formularz logowania
      React.createElement('form', { onSubmit: handleSubmit },
        // Nazwa użytkownika
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'username' }, 'Nazwa użytkownika'),
          React.createElement('input', {
            type: 'text',
            id: 'username',
            className: 'form-control',
            value: username,
            onChange: handleUsernameChange,
            disabled: isLoading,
            autoFocus: true,
            required: true
          })
        ),
        
        // Hasło
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'password' }, 'Hasło'),
          React.createElement('input', {
            type: 'password',
            id: 'password',
            className: 'form-control',
            value: password,
            onChange: handlePasswordChange,
            disabled: isLoading,
            required: true
          })
        ),
        
        // Przycisk logowania
        React.createElement('button', {
          type: 'submit',
          className: 'login-button',
          disabled: isLoading
        }, isLoading ? 'Logowanie...' : 'Zaloguj się')
      ),
      
      // Pomoc i informacje
      React.createElement('div', { className: 'login-help', style: { marginTop: '20px', textAlign: 'center' } },
        React.createElement('p', null, 'Użyj danych testowych:'),
        React.createElement('p', { style: { fontWeight: 'bold' } }, 'Login: admin, Hasło: admin123')
      )
    )
  );
};