/**
 * Główny komponent układu aplikacji
 */
const AppLayout = ({ children }) => {
  // Stan zwinięcia menu bocznego
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  
  // Przełączanie stanu menu bocznego
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Wykrywanie rozmiaru ekranu i automatyczne zwijanie menu na małych ekranach
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };
    
    // Wywołanie przy montowaniu komponentu
    handleResize();
    
    // Dodanie nasłuchiwacza zdarzeń
    window.addEventListener('resize', handleResize);
    
    // Usunięcie nasłuchiwacza przy odmontowaniu komponentu
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarCollapsed]);
  
  return React.createElement('div', { 
    className: `app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`
  },
    // Menu boczne
    React.createElement(SideBar, { 
      collapsed: sidebarCollapsed,
      toggleSidebar: toggleSidebar
    }),
    
    // Główna zawartość
    React.createElement('main', { className: 'main-content' },
      // Pasek nawigacyjny
      React.createElement(NavBar, { toggleSidebar: toggleSidebar }),
      
      // Zawartość strony
      React.createElement('div', { className: 'page-content' },
        children
      )
    )
  );
};