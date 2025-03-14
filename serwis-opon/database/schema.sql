-- Serwis Opon - Schemat bazy danych
-- Wersja 1.0.0

-- Usunięcie bazy danych jeśli istnieje (opcjonalne)
-- DROP DATABASE IF EXISTS serwis_opon;

-- Utworzenie bazy danych
CREATE DATABASE IF NOT EXISTS serwis_opon CHARACTER SET utf8mb4 COLLATE utf8mb4_polish_ci;

-- Wybór bazy danych do pracy
USE serwis_opon;

-- Tabela użytkowników systemu
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  role ENUM('admin', 'manager', 'employee') NOT NULL DEFAULT 'employee',
  active TINYINT(1) NOT NULL DEFAULT 1,
  last_login DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela klientów
CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  address VARCHAR(255),
  postal_code VARCHAR(10),
  city VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela pracowników
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  position VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  postal_code VARCHAR(10),
  city VARCHAR(50),
  hire_date DATE NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela stanowisk serwisowych
CREATE TABLE service_stations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela usług
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration INT NOT NULL COMMENT 'Duration in minutes',
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela rezerwacji
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  employee_id INT,
  station_id INT,
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
  FOREIGN KEY (station_id) REFERENCES service_stations(id) ON DELETE SET NULL
);

-- Tabela przechowalni opon
CREATE TABLE storage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  location VARCHAR(20) NOT NULL,
  deposit_date DATE NOT NULL,
  pickup_date DATE,
  tire_type ENUM('summer', 'winter', 'all_season') NOT NULL,
  tire_size VARCHAR(50) NOT NULL,
  tire_brand VARCHAR(50),
  quantity INT NOT NULL DEFAULT 4,
  status ENUM('in_storage', 'picked_up', 'in_service') DEFAULT 'in_storage',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Tabela kategorii produktów
CREATE TABLE inventory_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela produktów (inwentarz)
CREATE TABLE inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  sku VARCHAR(50),
  barcode VARCHAR(50),
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  min_quantity INT NOT NULL DEFAULT 5,
  location VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES inventory_categories(id) ON DELETE CASCADE
);

-- Tabela dostawców
CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  address VARCHAR(255),
  postal_code VARCHAR(10),
  city VARCHAR(50),
  tax_id VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela zamówień
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  employee_id INT,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cash', 'card', 'transfer', 'other') DEFAULT 'cash',
  payment_status ENUM('paid', 'unpaid', 'partial') DEFAULT 'unpaid',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Tabela elementów zamówień
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  item_type ENUM('service', 'product') NOT NULL,
  item_id INT NOT NULL COMMENT 'ID from services or inventory table',
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Tabela faktur
CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(20) NOT NULL UNIQUE,
  order_id INT NOT NULL,
  client_id INT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  vat_rate DECIMAL(5, 2) NOT NULL DEFAULT 23.00,
  status ENUM('issued', 'paid', 'overdue', 'cancelled') DEFAULT 'issued',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Tabela ustawień
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela alertów
CREATE TABLE alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'warning', 'error') DEFAULT 'info',
  status ENUM('active', 'resolved') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela logów systemu
CREATE TABLE system_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indeksy dla optymalizacji wydajności
CREATE INDEX idx_client_name ON clients(last_name, first_name);
CREATE INDEX idx_reservation_date ON reservations(date);
CREATE INDEX idx_reservation_status ON reservations(status);
CREATE INDEX idx_storage_client ON storage(client_id);
CREATE INDEX idx_storage_status ON storage(status);
CREATE INDEX idx_inventory_category ON inventory(category_id);
CREATE INDEX idx_order_client ON orders(client_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_invoice_number ON invoices(invoice_number);

-- Dane początkowe dla testów

-- Domyślny użytkownik admin (hasło: admin123)
INSERT INTO users (username, password, first_name, last_name, email, role)
VALUES ('admin', '$2y$10$qQSr1IZdOhJZHl9ItJ2zR.GOYTNjYkU0mGDLYqQbQjKEL9sIuCj2.', 'Adam', 'Nowak', 'admin@serwisopon.pl', 'admin');

-- Domyślne ustawienia
INSERT INTO settings (name, value, description) VALUES
('company_name', 'Serwis Opon', 'Nazwa firmy'),
('company_address', 'ul. Przykładowa 123', 'Adres firmy'),
('company_postal_code', '00-000', 'Kod pocztowy'),
('company_city', 'Warszawa', 'Miasto'),
('company_nip', '1234567890', 'NIP firmy'),
('company_phone', '123 456 789', 'Telefon kontaktowy'),
('company_email', 'kontakt@serwisopon.pl', 'Email kontaktowy'),
('company_website', 'www.serwisopon.pl', 'Strona internetowa'),
('vat_rate', '23', 'Domyślna stawka VAT (%)'),
('currency', 'PLN', 'Waluta'),
('storage_capacity', '200', 'Pojemność przechowalni (liczba kompletów)');

-- Przykładowi klienci
INSERT INTO clients (first_name, last_name, phone, email, address, postal_code, city) VALUES
('Jan', 'Kowalski', '600 100 200', 'jan.kowalski@przykład.pl', 'ul. Kowalska 1', '00-001', 'Warszawa'),
('Anna', 'Nowak', '601 200 300', 'anna.nowak@przykład.pl', 'ul. Nowakowska 2', '00-002', 'Warszawa'),
('Piotr', 'Wiśniewski', '602 300 400', 'piotr.wisniewski@przykład.pl', 'ul. Wiśniowa 3', '00-003', 'Warszawa'),
('Katarzyna', 'Lewandowska', '603 400 500', 'katarzyna.lewandowska@przykład.pl', 'ul. Lewandowska 4', '00-004', 'Warszawa'),
('Michał', 'Kaczmarek', '604 500 600', 'michal.kaczmarek@przykład.pl', 'ul. Kaczmarska 5', '00-005', 'Warszawa');

-- Przykładowi pracownicy
INSERT INTO employees (first_name, last_name, position, phone, email, hire_date) VALUES
('Adam', 'Nowak', 'Kierownik', '700 100 100', 'adam.nowak@serwisopon.pl', '2022-01-01'),
('Marek', 'Kowalczyk', 'Mechanik', '700 100 101', 'marek.kowalczyk@serwisopon.pl', '2022-02-01'),
('Tomasz', 'Jankowski', 'Mechanik', '700 100 102', 'tomasz.jankowski@serwisopon.pl', '2022-03-01');

-- Stanowiska serwisowe
INSERT INTO service_stations (name, status) VALUES
('Stanowisko 1', 'available'),
('Stanowisko 2', 'available'),
('Stanowisko 3', 'available'),
('Stanowisko 4', 'maintenance');

-- Przykładowe usługi
INSERT INTO services (name, description, price, duration) VALUES
('Wymiana opon (komplet)', 'Wymiana 4 opon', 120.00, 30),
('Wyważanie koła', 'Wyważanie jednego koła', 25.00, 15),
('Naprawa przebitej opony', 'Naprawa przebitej opony bez demontażu', 50.00, 20),
('Przechowanie opon (sezon)', 'Przechowanie kompletu opon na jeden sezon', 200.00, 15),
('Wymiana + wyważanie (komplet)', 'Wymiana i wyważanie 4 kół', 200.00, 60);

-- Przykładowe rezerwacje
INSERT INTO reservations (client_id, date, time, service_type, employee_id, station_id, status) VALUES
(1, CURDATE(), '08:00:00', 'Wymiana opon (4 szt.)', 2, 1, 'completed'),
(2, CURDATE(), '09:30:00', 'Przechowanie opon (4 szt.)', 3, 2, 'in_progress'),
(3, CURDATE(), '11:00:00', 'Wymiana + wyważanie (4 szt.)', 2, 3, 'pending'),
(4, CURDATE(), '13:30:00', 'Naprawa opony', 3, 1, 'pending'),
(5, CURDATE(), '15:00:00', 'Odbiór opon z przechowalni', 2, 2, 'pending');

-- Przykładowe dane przechowalni
INSERT INTO storage (client_id, location, deposit_date, tire_type, tire_size, tire_brand, quantity, status) VALUES
(1, 'A01-01', '2023-10-15', 'winter', '205/55 R16', 'Michelin', 4, 'in_storage'),
(2, 'A01-02', '2023-11-05', 'summer', '195/65 R15', 'Continental', 4, 'in_storage'),
(3, 'A02-01', '2023-10-20', 'winter', '225/45 R17', 'Bridgestone', 4, 'in_storage'),
(4, 'A02-02', '2023-11-10', 'summer', '205/60 R16', 'Goodyear', 4, 'in_storage'),
(5, 'A03-01', '2023-10-25', 'winter', '215/55 R17', 'Pirelli', 4, 'in_storage');

-- Kategorie inwentarza
INSERT INTO inventory_categories (name, description) VALUES
('Opony letnie', 'Opony przeznaczone do jazdy w sezonie letnim'),
('Opony zimowe', 'Opony przeznaczone do jazdy w sezonie zimowym'),
('Opony całoroczne', 'Opony przeznaczone do jazdy przez cały rok'),
('Felgi stalowe', 'Felgi stalowe różnych rozmiarów'),
('Felgi aluminiowe', 'Felgi aluminiowe różnych rozmiarów'),
('Akcesoria', 'Akcesoria do opon i kół');

-- Przykładowe alerty
INSERT INTO alerts (title, message, type, status) VALUES
('Niski stan magazynowy', 'Niski stan opon zimowych 205/55 R16', 'warning', 'active'),
('Problem z kompresorem', 'Kompresor na stanowisku 2 wymaga serwisu', 'error', 'active'),
('Nowa dostawa', 'Dostawa opon letnich zaplanowana na jutro', 'info', 'active');