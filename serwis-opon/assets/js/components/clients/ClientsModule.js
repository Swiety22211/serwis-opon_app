
// Sprawdź, czy apiService jest dostępny globalnie, a jeśli nie, zaimportuj go
let apiService;
try {
  if (window.api && window.api.service) {
    apiService = window.api.service;
  } else {
    // Próba importu z pliku
    import('../../utils/api.js').then(module => {
      apiService = module.default || module;
    });
  }
} catch (error) {
  console.error('Błąd podczas importu api.service:', error);
  apiService = {
    get: async () => { throw new Error('API service nie jest dostępny'); },
    post: async () => { throw new Error('API service nie jest dostępny'); },
    put: async () => { throw new Error('API service nie jest dostępny'); },
    delete: async () => { throw new Error('API service nie jest dostępny'); }
  };
}

/**
 * Moduł klientów dla aplikacji Serwis Opon
 * Plik umieść w: /assets/js/components/clients/ClientsModule.js
 */

// Importuj serwis API - dostosuj ścieżkę, jeśli Twoja struktura plików jest inna
import apiService from '../../services/api.service.js';

// 1. Model danych klienta
class Klient {
  constructor(id, imie, nazwisko, telefon, email, adres, historia = [], dataUtworzenia = new Date(), aktywny = true) {
    this.id = id;                 // Unikalny identyfikator klienta
    this.imie = imie;             // Imię klienta
    this.nazwisko = nazwisko;     // Nazwisko klienta
    this.telefon = telefon;       // Numer telefonu
    this.email = email || '';     // Adres email
    this.adres = adres || '';     // Adres (można rozszerzyć na obiekt z ulicą, miastem, kodem pocztowym)
    this.historia = historia;     // Historia usług/wizyt (tablica obiektów)
    this.dataUtworzenia = dataUtworzenia; // Data dodania klienta do systemu
    this.aktywny = aktywny;       // Czy klient jest aktywny
  }
}

// 2. Model danych historii usług
class HistoriaUslugi {
  constructor(id, dataUslugi, typUslugi, opis, cena, oponki = [], status = 'zakończona') {
    this.id = id;                 // Unikalny identyfikator usługi
    this.dataUslugi = dataUslugi; // Data wykonania usługi
    this.typUslugi = typUslugi;   // Typ usługi (np. wymiana opon, przechowywanie)
    this.opis = opis;             // Szczegółowy opis wykonanej usługi
    this.cena = cena;             // Cena usługi
    this.oponki = oponki;         // Informacje o oponach (np. rozmiar, marka, stan)
    this.status = status;         // Status usługi (zakończona, w trakcie, zaplanowana)
  }
}

// 3. Klasa zarządzająca klientami
class KlienciManager {
  constructor() {
    this.klienci = [];
    this.nextId = 1;
    this.loaded = false;
    
    // Wczytaj dane z API przy inicjalizacji
    this.wczytajDane();
  }

  // Wczytywanie danych z API
  async wczytajDane() {
    try {
      const response = await apiService.get('/clients');
      if (response.status === 'success') {
        this.klienci = response.data.map(client => {
          return new Klient(
            client.id,
            client.imie,
            client.nazwisko,
            client.telefon,
            client.email,
            client.adres,
            client.historia || [],
            new Date(client.dataUtworzenia),
            client.aktywny === 1 || client.aktywny === true
          );
        });
        
        // Znajdź najwyższe ID, aby kontynuować numerację
        if (this.klienci.length > 0) {
          this.nextId = Math.max(...this.klienci.map(k => parseInt(k.id))) + 1;
        }
        
        this.loaded = true;
      } else {
        console.error('Błąd podczas pobierania klientów:', response.message);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania klientów:', error);
    }
    
    return this.klienci;
  }

  // Sprawdzenie, czy dane zostały załadowane
  isLoaded() {
    return this.loaded;
  }

  // Dodawanie nowego klienta
  async dodajKlienta(imie, nazwisko, telefon, email, adres) {
    const nowyKlient = new Klient(null, imie, nazwisko, telefon, email, adres);
    
    try {
      const response = await apiService.post('/clients', nowyKlient);
      if (response.status === 'success') {
        const dodanyKlient = new Klient(
          response.data.id,
          response.data.imie,
          response.data.nazwisko,
          response.data.telefon,
          response.data.email,
          response.data.adres,
          response.data.historia || [],
          new Date(response.data.dataUtworzenia),
          response.data.aktywny === 1 || response.data.aktywny === true
        );
        
        this.klienci.push(dodanyKlient);
        return dodanyKlient;
      } else {
        console.error('Błąd podczas dodawania klienta:', response.message);
        return null;
      }
    } catch (error) {
      console.error('Błąd podczas dodawania klienta:', error);
      return null;
    }
  }

  // Edycja danych klienta
  async edytujKlienta(id, dane) {
    try {
      const response = await apiService.put(`/clients/${id}`, dane);
      if (response.status === 'success') {
        // Aktualizuj w lokalnej tablicy
        const index = this.klienci.findIndex(k => parseInt(k.id) === parseInt(id));
        if (index !== -1) {
          const zaktualizowanyKlient = new Klient(
            response.data.id,
            response.data.imie,
            response.data.nazwisko,
            response.data.telefon,
            response.data.email,
            response.data.adres,
            response.data.historia || this.klienci[index].historia,
            new Date(response.data.dataUtworzenia),
            response.data.aktywny === 1 || response.data.aktywny === true
          );
          
          this.klienci[index] = zaktualizowanyKlient;
        }
        
        return response.data;
      } else {
        console.error('Błąd podczas aktualizacji klienta:', response.message);
        return null;
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji klienta:', error);
      return null;
    }
  }

  // Usuwanie klienta (zmiana statusu na nieaktywny)
  async usunKlienta(id) {
    try {
      const response = await apiService.delete(`/clients/${id}`);
      if (response.status === 'success') {
        // Aktualizuj lokalnie
        const index = this.klienci.findIndex(k => parseInt(k.id) === parseInt(id));
        if (index !== -1) {
          this.klienci[index].aktywny = false;
        }
        
        return true;
      } else {
        console.error('Błąd podczas usuwania klienta:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Błąd podczas usuwania klienta:', error);
      return false;
    }
  }

  // Pobieranie klienta po ID
  pobierzKlienta(id) {
    return this.klienci.find(k => parseInt(k.id) === parseInt(id));
  }

  // Pobieranie wszystkich aktywnych klientów
  pobierzAktywnychKlientow() {
    return this.klienci.filter(k => k.aktywny);
  }

  // Pobieranie wszystkich klientów (aktywnych i nieaktywnych)
  pobierzWszystkichKlientow() {
    return [...this.klienci];
  }

  // Wyszukiwanie klientów po różnych kryteriach
  wyszukajKlientow(fraza) {
    fraza = fraza.toLowerCase();
    return this.klienci.filter(k => 
      k.aktywny &&
      (k.imie.toLowerCase().includes(fraza) ||
       k.nazwisko.toLowerCase().includes(fraza) ||
       k.telefon.includes(fraza) ||
       (k.email && k.email.toLowerCase().includes(fraza)))
    );
  }

  // Dodawanie usługi do historii klienta
  async dodajUsluge(klientId, dataUslugi, typUslugi, opis, cena, oponki = []) {
    try {
      const usluga = {
        client_id: klientId,
        dataUslugi,
        typUslugi,
        opis,
        cena,
        oponki
      };
      
      const response = await apiService.post(`/clients/${klientId}/services`, usluga);
      if (response.status === 'success') {
        // Aktualizuj lokalnie
        const klient = this.pobierzKlienta(klientId);
        if (klient) {
          const nowaUsluga = new HistoriaUslugi(
            response.data.id,
            response.data.dataUslugi,
            response.data.typUslugi,
            response.data.opis,
            response.data.cena,
            response.data.oponki || [],
            response.data.status
          );
          
          klient.historia.push(nowaUsluga);
        }
        
        return response.data;
      } else {
        console.error('Błąd podczas dodawania usługi:', response.message);
        return null;
      }
    } catch (error) {
      console.error('Błąd podczas dodawania usługi:', error);
      return null;
    }
  }

  // Pobieranie historii usług klienta
  pobierzHistorieKlienta(klientId) {
    const klient = this.pobierzKlienta(klientId);
    return klient ? klient.historia : [];
  }
}

// 4. Interfejs użytkownika - renderowanie listy klientów
function renderujListeKlientow(kontener, klienciManager) {
  const klienci = klienciManager.pobierzAktywnychKlientow();
  kontener.innerHTML = '';

  if (klienci.length === 0) {
    kontener.innerHTML = '<p class="brak-klientow">Brak klientów w bazie. Dodaj pierwszego klienta.</p>';
    return;
  }

  const table = document.createElement('table');
  table.className = 'klienci-tabela';
  
  // Nagłówek tabeli
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Imię i Nazwisko</th>
      <th>Telefon</th>
      <th>Email</th>
      <th>Akcje</th>
    </tr>
  `;
  table.appendChild(thead);
  
  // Ciało tabeli
  const tbody = document.createElement('tbody');
  klienci.forEach(klient => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${klient.id}</td>
      <td>${klient.imie} ${klient.nazwisko}</td>
      <td>${klient.telefon}</td>
      <td>${klient.email || ''}</td>
      <td>
        <button class="btn-szczegoly" data-id="${klient.id}">Szczegóły</button>
        <button class="btn-edytuj" data-id="${klient.id}">Edytuj</button>
        <button class="btn-usun" data-id="${klient.id}">Usuń</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  
  kontener.appendChild(table);
  
  // Dodaj obsługę zdarzeń dla przycisków
  dodajObslugeZdarzen(kontener, klienciManager);
}

// 5. Obsługa zdarzeń dla przycisków w tabeli klientów
function dodajObslugeZdarzen(kontener, klienciManager) {
  // Obsługa przycisku "Szczegóły"
  kontener.querySelectorAll('.btn-szczegoly').forEach(btn => {
    btn.addEventListener('click', () => {
      const klientId = parseInt(btn.dataset.id);
      pokazSzczegolyKlienta(klientId, klienciManager);
    });
  });
  
  // Obsługa przycisku "Edytuj"
  kontener.querySelectorAll('.btn-edytuj').forEach(btn => {
    btn.addEventListener('click', () => {
      const klientId = parseInt(btn.dataset.id);
      pokazFormularzEdycji(klientId, klienciManager);
    });
  });
  
  // Obsługa przycisku "Usuń"
  kontener.querySelectorAll('.btn-usun').forEach(btn => {
    btn.addEventListener('click', async () => {
      const klientId = parseInt(btn.dataset.id);
      if (confirm('Czy na pewno chcesz usunąć tego klienta?')) {
        const success = await klienciManager.usunKlienta(klientId);
        if (success) {
          renderujListeKlientow(kontener, klienciManager);
        }
      }
    });
  });
}

// 6. Wyświetlanie szczegółów klienta
function pokazSzczegolyKlienta(klientId, klienciManager) {
  const klient = klienciManager.pobierzKlienta(klientId);
  if (!klient) return;
  
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // Nagłówek modala
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  modalHeader.innerHTML = `
    <h2>Szczegóły klienta</h2>
    <button class="btn-zamknij">&times;</button>
  `;
  
  // Zawartość modala - dane klienta
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';
  
  // Formatowanie daty
  const dataUtworzenia = klient.dataUtworzenia instanceof Date 
    ? klient.dataUtworzenia.toLocaleDateString() 
    : new Date(klient.dataUtworzenia).toLocaleDateString();
  
  modalBody.innerHTML = `
    <div class="dane-klienta">
      <p><strong>ID:</strong> ${klient.id}</p>
      <p><strong>Imię i Nazwisko:</strong> ${klient.imie} ${klient.nazwisko}</p>
      <p><strong>Telefon:</strong> ${klient.telefon}</p>
      <p><strong>Email:</strong> ${klient.email || '-'}</p>
      <p><strong>Adres:</strong> ${klient.adres || '-'}</p>
      <p><strong>Data utworzenia:</strong> ${dataUtworzenia}</p>
    </div>
    
    <h3>Historia usług</h3>
    <div class="historia-uslug">
      ${renderujHistorieUslug(klient.historia)}
    </div>
    
    <div class="modal-actions">
      <button class="btn-dodaj-usluge">Dodaj nową usługę</button>
    </div>
  `;
  
  // Stopka modala
  const modalFooter = document.createElement('div');
  modalFooter.className = 'modal-footer';
  modalFooter.innerHTML = `
    <button class="btn-zamknij-modal">Zamknij</button>
  `;
  
  // Połącz wszystkie elementy
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  modalContainer.appendChild(modalContent);
  
  // Dodaj modal do body
  document.body.appendChild(modalContainer);
  
  // Obsługa zamykania modala
  modalContainer.querySelector('.btn-zamknij').addEventListener('click', () => {
    document.body.removeChild(modalContainer);
  });
  
  modalContainer.querySelector('.btn-zamknij-modal').addEventListener('click', () => {
    document.body.removeChild(modalContainer);
  });
  
  // Obsługa dodawania nowej usługi
  modalContainer.querySelector('.btn-dodaj-usluge').addEventListener('click', () => {
    document.body.removeChild(modalContainer);
    pokazFormularzDodawaniaUslugi(klientId, klienciManager);
  });
}

// 7. Renderowanie historii usług klienta
function renderujHistorieUslug(historia) {
  if (!historia || historia.length === 0) {
    return '<p>Brak historii usług dla tego klienta.</p>';
  }
  
  let html = '<table class="historia-tabela">';
  html += `
    <thead>
      <tr>
        <th>Data</th>
        <th>Typ usługi</th>
        <th>Opis</th>
        <th>Cena</th>
      </tr>
    </thead>
    <tbody>
  `;
  
  historia.forEach(usluga => {
    // Formatowanie daty
    const dataUslugi = usluga.dataUslugi instanceof Date 
      ? usluga.dataUslugi.toLocaleDateString() 
      : new Date(usluga.dataUslugi).toLocaleDateString();
    
    html += `
      <tr>
        <td>${dataUslugi}</td>
        <td>${usluga.typUslugi}</td>
        <td>${usluga.opis}</td>
        <td>${parseFloat(usluga.cena).toFixed(2)} zł</td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  return html;
}

// 8. Formularz dodawania nowego klienta
function pokazFormularzDodawaniaKlienta(kontener, klienciManager) {
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  
  formContainer.innerHTML = `
    <h2>Dodaj nowego klienta</h2>
    <form id="form-dodaj-klienta">
      <div class="form-group">
        <label for="imie">Imię:</label>
        <input type="text" id="imie" name="imie" required>
      </div>
      
      <div class="form-group">
        <label for="nazwisko">Nazwisko:</label>
        <input type="text" id="nazwisko" name="nazwisko" required>
      </div>
      
      <div class="form-group">
        <label for="telefon">Telefon:</label>
        <input type="tel" id="telefon" name="telefon" required>
      </div>
      
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email">
      </div>
      
      <div class="form-group">
        <label for="adres">Adres:</label>
        <textarea id="adres" name="adres" rows="3"></textarea>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-zapisz">Zapisz</button>
        <button type="button" class="btn-anuluj">Anuluj</button>
      </div>
    </form>
  `;
  
  kontener.innerHTML = '';
  kontener.appendChild(formContainer);
  
  // Obsługa formularza
  document.getElementById('form-dodaj-klienta').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const imie = document.getElementById('imie').value;
    const nazwisko = document.getElementById('nazwisko').value;
    const telefon = document.getElementById('telefon').value;
    const email = document.getElementById('email').value;
    const adres = document.getElementById('adres').value;
    
    // Dodaj klienta i odśwież listę
    await klienciManager.dodajKlienta(imie, nazwisko, telefon, email, adres);
    renderujListeKlientow(kontener, klienciManager);
  });
  
  document.querySelector('.btn-anuluj').addEventListener('click', () => {
    renderujListeKlientow(kontener, klienciManager);
  });
}

// 9. Formularz edycji klienta
function pokazFormularzEdycji(klientId, klienciManager) {
  const klient = klienciManager.pobierzKlienta(klientId);
  if (!klient) return;
  
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  modalContent.innerHTML = `
    <div class="modal-header">
      <h2>Edytuj dane klienta</h2>
      <button class="btn-zamknij">&times;</button>
    </div>
    
    <div class="modal-body">
      <form id="form-edytuj-klienta">
        <div class="form-group">
          <label for="edit-imie">Imię:</label>
          <input type="text" id="edit-imie" name="imie" value="${klient.imie}" required>
        </div>
        
        <div class="form-group">
          <label for="edit-nazwisko">Nazwisko:</label>
          <input type="text" id="edit-nazwisko" name="nazwisko" value="${klient.nazwisko}" required>
        </div>
        
        <div class="form-group">
          <label for="edit-telefon">Telefon:</label>
          <input type="tel" id="edit-telefon" name="telefon" value="${klient.telefon}" required>
        </div>
        
        <div class="form-group">
          <label for="edit-email">Email:</label>
          <input type="email" id="edit-email" name="email" value="${klient.email || ''}">
        </div>
        
        <div class="form-group">
          <label for="edit-adres">Adres:</label>
          <textarea id="edit-adres" name="adres" rows="3">${klient.adres || ''}</textarea>
        </div>
      </form>
    </div>
    
    <div class="modal-footer">
      <button class="btn-zapisz">Zapisz zmiany</button>
      <button class="btn-anuluj">Anuluj</button>
    </div>
  `;
  
  document.body.appendChild(modalContainer);
  modalContainer.appendChild(modalContent);
  
  // Obsługa zamykania modala
  modalContainer.querySelector('.btn-zamknij').addEventListener('click', () => {
    document.body.removeChild(modalContainer);
  });
  
  modalContainer.querySelector('.btn-anuluj').addEventListener('click', () => {
    document.body.removeChild(modalContainer);
  });
  
  // Obsługa zapisywania zmian
  modalContainer.querySelector('.btn-zapisz').addEventListener('click', async () => {
    const dane = {
      imie: document.getElementById('edit-imie').value,
      nazwisko: document.getElementById('edit-nazwisko').value,
      telefon: document.getElementById('edit-telefon').value,
      email: document.getElementById('edit-email').value,
      adres: document.getElementById('edit-adres').value
    };
    
    await klienciManager.edytujKlienta(klientId, dane);
    document.body.removeChild(modalContainer);
    
    // Odśwież listę klientów, jeśli kontener jest dostępny
    const kontener = document.querySelector('.klienci-kontener');
    if (kontener) {
      renderujListeKlientow(kontener.querySelector('.lista-klientow-kontener'), klienciManager);
    }
  });
}

// 10. Formularz dodawania nowej usługi dla klienta
function pokazFormularzDodawaniaUslugi(klientId, klienciManager) {
  const klient = klienciManager.pobierzKlienta(klientId);
  if (!klient) return;
  
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  modalContent.innerHTML = `
    <div class="modal-header">
      <h2>Dodaj nową usługę</h2>
      <button class="btn-zamknij">&times;</button>
    </div>
    
    <div class="modal-body">
      <p><strong>Klient:</strong> ${klient.imie} ${klient.nazwisko}</p>
      
      <form id="form-dodaj-usluge">
        <div class="form-group">
          <label for="data-uslugi">Data usługi:</label>
          <input type="date" id="data-uslugi" name="dataUslugi" value="${new Date().toISOString().split('T')[0]}" required>
        </div>
        
        <div class="form-group">
          <label for="typ-uslugi">Typ usługi:</label>
          <select id="typ-uslugi" name="typUslugi" required>
            <option value="">Wybierz typ usługi</option>
            <option value="Wymiana opon">Wymiana opon</option>
            <option value="Przechowanie opon">Przechowanie opon</option>
            <option value="Naprawa opony">Naprawa opony</option>
            <option value="Wyważanie kół">Wyważanie kół</option>
            <option value="Inne">Inne</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="opis-uslugi">Opis usługi:</label>
          <textarea id="opis-uslugi" name="opis" rows="3" required></textarea>
        </div>
        
        <div class="form-group">
          <label for="cena-uslugi">Cena (zł):</label>
          <input type="number" id="cena-uslugi" name="cena" min="0" step="0.01" required>
        </div>
        
        <div class="form-group opony-info">
          <h3>Informacje o oponach</h3>
          <div id="opony-container">
            <div class="opona-item">
              <input type="text" placeholder="Marka i model" name="opona-marka">
              <input type="text" placeholder="Rozmiar" name="opona-rozmiar">
              <input type="text" placeholder="Stan (np. nowe, używane)" name="opona-stan">
              <button type="button" class="btn-usun-opone">Usuń</button>
            </div>
          </div>
          <button type="button" id="btn-dodaj-opone">Dodaj kolejną oponę</button>
        </div>
      </form>
    </div>
    
    <div class="modal-footer">
      <button class="btn-zapisz">Zapisz usługę</button>
      <button class="btn-anuluj">Anuluj</button>
    </div>
  `;
  
  document.body.appendChild(modalContainer);
  modalContainer.appendChild(modalContent);
  
  // Obsługa dodawania pól dla kolejnych opon
  document.getElementById('btn-dodaj-opone').addEventListener('click', () => {
    const oponaItem = document.createElement('div');
    oponaItem.className = 'opona-item';
    oponaItem.innerHTML = `
      <input type="text" placeholder="Marka i model" name="opona-marka">
      <input type="text" placeholder="Rozmiar" name="opona-rozmiar">
      <input type="text" placeholder="Stan (np. nowe, używane)" name="opona-stan">
      <button type="button" class="btn-usun-opone">Usuń</button>
    `;
    
    document.getElementById('opony-container').appendChild(oponaItem);
    
    // Obsługa usuwania pola opony
    oponaItem.querySelector('.btn-usun-opone').addEventListener('click', () => {
      oponaItem.remove();
    });
  });
  
  // Obsługa usuwania pierwszego pola opony
  document.querySelector('.btn-usun-opone').addEventListener('click', function() {
    this.parentElement.remove();
  });
  
  // Obsługa zamykania modala
  modalContainer.querySelector('.btn-zamknij').addEventListener('click', () => {
    document.body.removeChild(modalContainer);
  });
  
  modalContainer.querySelector('.btn-anuluj').addEventListener('click', () => {
    document.body.removeChild(modalContainer);
  });
  
  // Obsługa zapisywania usługi
  modalContainer.querySelector('.btn-zapisz').addEventListener('click', async () => {
    const dataUslugi = document.getElementById('data-uslugi').value;
    const typUslugi = document.getElementById('typ-uslugi').value;
    const opis = document.getElementById('opis-uslugi').value;
    const cena = parseFloat(document.getElementById('cena-uslugi').value);
    
    // Zbierz informacje o oponach
    const oponki = [];
    document.querySelectorAll('.opona-item').forEach(item => {
      const marka = item.querySelector('[name="opona-marka"]').value;
      const rozmiar = item.querySelector('[name="opona-rozmiar"]').value;
      const stan = item.querySelector('[name="opona-stan"]').value;
      
      if (marka || rozmiar || stan) {
        oponki.push({ marka, rozmiar, stan });
      }
    });
    
    await klienciManager.dodajUsluge(klientId, dataUslugi, typUslugi, opis, cena, oponki);
    document.body.removeChild(modalContainer);
    
    // Pokaż szczegóły klienta z zaktualizowaną historią
    pokazSzczegolyKlienta(klientId, klienciManager);
  });
}

// 11. Funkcja inicjalizująca moduł klientów
async function inicjalizujModulKlientow() {
  // Utwórz i załaduj manager klientów
  const klienciManager = new KlienciManager();
  
  // Utwórz kontener dla modułu klientów
  const kontener = document.querySelector('.klienci-kontener') || document.createElement('div');
  
  if (!document.querySelector('.klienci-kontener')) {
    kontener.className = 'klienci-kontener';
    document.getElementById('main-content').appendChild(kontener);
  }
  
  // Dodaj loader podczas ładowania danych
  kontener.innerHTML = '<div class="loading">Ładowanie danych klientów...</div>';
  
  // Poczekaj na załadowanie danych
  await klienciManager.wczytajDane();
  
  // Przyciski akcji
  const actionsBar = document.createElement('div');
  actionsBar.className = 'actions-bar';
  actionsBar.innerHTML = `
    <div class="search-container">
      <input type="text" id="search-klienci" placeholder="Szukaj klienta...">
      <button id="btn-szukaj">Szukaj</button>
    </div>
    <button id="btn-dodaj-klienta" class="btn-primary">Dodaj nowego klienta</button>
  `;
  
  kontener.innerHTML = '';
  kontener.appendChild(actionsBar);
  
  // Kontener na listę klientów
  const listaKontener = document.createElement('div');
  listaKontener.className = 'lista-klientow-kontener';
  kontener.appendChild(listaKontener);
  
  // Renderuj listę klientów
  renderujListeKlientow(listaKontener, klienciManager);
  
  // Obsługa przycisku dodawania klienta
  document.getElementById('btn-dodaj-klienta').addEventListener('click', () => {
    pokazFormularzDodawaniaKlienta(listaKontener, klienciManager);
  });
  
  // Obsługa wyszukiwania klientów
  document.getElementById('btn-szukaj').addEventListener('click', () => {
    const fraza = document.getElementById('search-klienci').value;
    if (fraza.trim()) {
      const wyniki = klienciManager.wyszukajKlientow(fraza);
      
      listaKontener.innerHTML = '';
      
      if (wyniki.length === 0) {
        listaKontener.innerHTML = `<p>Nie znaleziono klientów dla frazy: "${fraza}"</p>`;
        const btnPowrot = document.createElement('button');
        btnPowrot.textContent = 'Pokaż wszystkich klientów';
        btnPowrot.className = 'btn-powrot';
        btnPowrot.addEventListener('click', () => {
          renderujListeKlientow(listaKontener, klienciManager);
        });
        listaKontener.appendChild(btnPowrot);
      } else {
        const tempManager = {
          pobierzAktywnychKlientow: () => wyniki
        };
        renderujListeKlientow(listaKontener, tempManager);
        
        const btnPowrot = document.createElement('button');
        btnPowrot.textContent = 'Pokaż wszystkich klientów';
        btnPowrot.className = 'btn-powrot';
        btnPowrot.addEventListener('click', () => {
          renderujListeKlientow(listaKontener, klienciManager);
        });
        listaKontener.appendChild(btnPowrot);
      }
    } else {
      renderujListeKlientow(listaKontener, klienciManager);
    }
  });
  
  // Obsługa wyszukiwania przy naciśnięciu Enter
  document.getElementById('search-klienci').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('btn-szukaj').click();
    }
  });
}

// 12. Funkcja integrująca moduł klientów z główną aplikacją
function integracjaModuluKlientow() {
  // 1. Dodanie przycisku do menu głównego aplikacji
  function dodajPrzyciskMenu() {
    const menuContainer = document.querySelector('.menu-container') || document.getElementById('main-menu');
    
    if (menuContainer) {
      const menuItem = document.createElement('button');
      menuItem.className = 'menu-item';
      menuItem.id = 'menu-klienci';
      menuItem.innerHTML = '<i class="fas fa-users"></i> Klienci';
      
      menuItem.addEventListener('click', () => {
        // Oznacz ten przycisk jako aktywny
        document.querySelectorAll('.menu-item').forEach(item => {
          item.classList.remove('active');
        });
        menuItem.classList.add('active');
        
        // Ukryj inne moduły i pokaż moduł klientów
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = '';
        
        const klienciKontener = document.createElement('div');
        klienciKontener.className = 'klienci-kontener';
        mainContent.appendChild(klienciKontener);
        
        // Inicjalizuj moduł klientów
        inicjalizujModulKlientow();
      });
      
      menuContainer.appendChild(menuItem);
    }
  }
  
  // 2. Eksport obiektów dla innych modułów
  window.SerwisOpon = window.SerwisOpon || {};
  window.SerwisOpon.KlienciManager = KlienciManager;
  
  // Funkcje pomocnicze do wykorzystania w innych modułach
  window.SerwisOpon.pobierzKlienciManager = () => new KlienciManager();
  window.SerwisOpon.renderujListeKlientowSelect = async (selectElement, klienciManager) => {
    // Upewnij się, że dane są załadowane
    if (!klienciManager.isLoaded()) {
      await klienciManager.wczytajDane();
    }
    
    const klienci = klienciManager.pobierzAktywnychKlientow();
    
    selectElement.innerHTML = '<option value="">Wybierz klienta</option>';
    
    klienci.forEach(klient => {
      const option = document.createElement('option');
      option.value = klient.id;
      option.textContent = `${klient.imie} ${klient.nazwisko} (tel: ${klient.telefon})`;
      selectElement.appendChild(option);
    });
  };
  
  // 3. Inicjalizacja menu
  dodajPrzyciskMenu();
}

// Ładowanie stylów CSS (alternatywa do pliku zewnętrznego)
function dodajStyleCSS() {
  const styleId = 'klienci-module-styles';
  
  // Sprawdź, czy style już istnieją
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    
    // Zawartość stylów przeniesiona do zewnętrznego pliku clients.css
    // W razie potrzeby możesz tutaj dodać dodatkowe style lub korekty
    
    document.head.appendChild(styleElement);
  }
}

// Eksport funkcji dla modułów ES6
export {
  inicjalizujModulKlientow,
  KlienciManager,
  integracjaModuluKlientow
};