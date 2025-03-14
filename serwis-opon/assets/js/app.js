/**
 * Główny plik aplikacji Serwis Opon
 */

// Wykorzystanie destrukturyzacji obiektów z zewnętrznych bibliotek
const { useState, useEffect } = React;
const { HashRouter, Routes, Route, Navigate } = ReactRouterDOM;

import './components/clients/ClientsModule.js';

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

// Obsługa modułu klientów
document.addEventListener('DOMContentLoaded', function() {
  const clientsLink = document.querySelector('a[href="#clients"]');
  
  if (clientsLink) {
    clientsLink.addEventListener('click', async function(e) {
      e.preventDefault();
      
      // Usuń klasę active ze wszystkich linków
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      
      // Dodaj klasę active do klikniętego linku
      this.classList.add('active');
      
      // Ukryj wszystkie sekcje
      document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
      });
      
      // Pokaż sekcję klientów
      const clientsSection = document.getElementById('clients-section');
      clientsSection.style.display = 'block';
      
      try {
        // Dynamiczne ładowanie modułu klientów
        const ClientsModule = await import('/assets/js/components/clients/ClientsModule.js');
        
        // Wyczyść sekcję i przygotuj kontener
        clientsSection.innerHTML = '';
        const klienciKontener = document.createElement('div');
        klienciKontener.className = 'klienci-kontener';
        clientsSection.appendChild(klienciKontener);
        
        // Inicjalizuj moduł klientów
        ClientsModule.inicjalizujModulKlientow();
      } catch (error) {
        console.error('Błąd ładowania modułu klientów:', error);
        clientsSection.innerHTML = `
          <div class="container p-5">
            <div class="alert alert-danger">
              <h4><i class="fas fa-exclamation-triangle"></i> Wystąpił błąd podczas ładowania modułu klientów</h4>
              <p>Spróbuj odświeżyć stronę lub skontaktuj się z administratorem.</p>
              <pre class="bg-light p-3 mt-3">${error.message}</pre>
            </div>
          </div>
        `;
      }
    });
  }
});

// Renderowanie aplikacji
const rootElement = document.getElementById('app-root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));