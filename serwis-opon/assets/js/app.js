/**
 * Główny plik aplikacji Serwis Opon
 */

// Wykorzystanie destrukturyzacji obiektów z zewnętrznych bibliotek
const { useState, useEffect } = React;
const { HashRouter, Routes, Route, Navigate } = ReactRouterDOM;

/**
 * Komponent Login - strona logowania
 */
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // W rzeczywistej aplikacji tutaj byłoby wywołanie API
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          name: 'Adam Nowak',
          role: 'admin'
        }));
        window.location.hash = '#/';
      } else {
        setError('Nieprawidłowa nazwa użytkownika lub hasło');
      }
      setIsLoading(false);
    }, 1000);
  };
  
  return React.createElement('div', { className: 'login-container' },
    React.createElement('div', { className: 'login-form' },
      // Logo
      React.createElement('div', { className: 'login-logo' }, '🔧'),
      
      // Tytuł
      React.createElement('h1', { className: 'login-title' }, 'Serwis Opon'),
      
      // Komunikat błędu
      error && React.createElement('div', { className: 'login-error' }, error),
      
      // Formularz logowania
      React.createElement('form', { onSubmit: handleLogin },
        // Nazwa użytkownika
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'username' }, 'Nazwa użytkownika'),
          React.createElement('input', {
            type: 'text',
            id: 'username',
            value: username,
            onChange: (e) => setUsername(e.target.value),
            className: 'form-control',
            required: true,
            autoFocus: true
          })
        ),
        
        // Hasło
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'password' }, 'Hasło'),
          React.createElement('input', {
            type: 'password',
            id: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: 'form-control',
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
      
      // Podpowiedź do logowania
      React.createElement('p', { className: 'mt-3 text-center' },
        'Użyj: admin / admin123'
      )
    )
  );
};

/**
 * Komponent ProtectedRoute - chroni trasy przed dostępem bez logowania
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return React.createElement(Navigate, { to: '/login' });
  }
  
  return children;
};

/**
 * Główny komponent aplikacji
 */
const App = () => {
  return React.createElement(HashRouter, null,
    React.createElement(Routes, null,
      // Strona logowania
      React.createElement(Route, { 
        path: '/login',
        element: React.createElement(Login)
      }),
      
      // Chronione trasy aplikacji
      React.createElement(Route, { 
        path: '/',
        element: React.createElement(ProtectedRoute, null,
          React.createElement(AppLayout, null,
            React.createElement(Dashboard)
          )
        )
      }),
      
      // Trasa dla ustawień
      React.createElement(Route, { 
        path: '/settings',
        element: React.createElement(ProtectedRoute, null,
          React.createElement(AppLayout, null,
            React.createElement(Settings)
          )
        )
      }),
      
      // Przekierowanie na stronę główną dla nieznanych tras
      React.createElement(Route, { 
        path: '*',
        element: React.createElement(Navigate, { to: '/' })
      })
    )
  );
};

// Renderowanie aplikacji
const rootElement = document.getElementById('app-root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));