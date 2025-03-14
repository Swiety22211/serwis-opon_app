<?php
/**
 * Kontroler klientów
 * Plik umieść w: /api/controllers/ClientsController.php
 */

class ClientsController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Pobierz wszystkich klientów
     * 
     * @return array Tablica z danymi klientów
     */
    public function getAll() {
        try {
            $query = "SELECT * FROM clients WHERE aktywny = 1";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            
            $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Pobierz historię usług dla każdego klienta
            foreach ($clients as &$client) {
                $client['historia'] = $this->getClientServices($client['id']);
            }
            
            return [
                'status' => 'success',
                'data' => $clients
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Błąd podczas pobierania klientów: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Pobierz pojedynczego klienta po ID
     * 
     * @param int $id ID klienta
     * @return array Dane klienta
     */
    public function getById($id) {
        try {
            $query = "SELECT * FROM clients WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $client = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$client) {
                return [
                    'status' => 'error',
                    'message' => 'Klient o podanym ID nie istnieje'
                ];
            }
            
            // Pobierz historię usług
            $client['historia'] = $this->getClientServices($id);
            
            return [
                'status' => 'success',
                'data' => $client
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Błąd podczas pobierania klienta: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Dodaj nowego klienta
     * 
     * @return array Dane nowo utworzonego klienta
     */
    public function create() {
        try {
            // Pobierz dane z żądania
            $data = json_decode(file_get_contents("php://input"));
            
            // Sprawdź wymagane pola
            if (!isset($data->imie) || !isset($data->nazwisko) || !isset($data->telefon)) {
                return [
                    'status' => 'error',
                    'message' => 'Brak wymaganych danych (imię, nazwisko, telefon)'
                ];
            }
            
            $currentDate = date('Y-m-d H:i:s');
            
            $query = "INSERT INTO clients 
                      (imie, nazwisko, telefon, email, adres, dataUtworzenia, aktywny) 
                      VALUES (:imie, :nazwisko, :telefon, :email, :adres, :dataUtworzenia, 1)";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':imie', $data->imie);
            $stmt->bindParam(':nazwisko', $data->nazwisko);
            $stmt->bindParam(':telefon', $data->telefon);
            $stmt->bindParam(':email', $data->email);
            $stmt->bindParam(':adres', $data->adres);
            $stmt->bindParam(':dataUtworzenia', $currentDate);
            
            $stmt->execute();
            
            $id = $this->db->lastInsertId();
            
            // Pobierz i zwróć nowo utworzonego klienta
            return $this->getById($id);
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Błąd podczas dodawania klienta: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Aktualizuj dane klienta
     * 
     * @param int $id ID klienta do aktualizacji
     * @return array Zaktualizowane dane klienta
     */
    public function update($id) {
        try {
            // Sprawdź czy klient istnieje
            $checkQuery = "SELECT id FROM clients WHERE id = :id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();
            
            if ($checkStmt->rowCount() === 0) {
                return [
                    'status' => 'error',
                    'message' => 'Klient o podanym ID nie istnieje'
                ];
            }
            
            // Pobierz dane z żądania
            $data = json_decode(file_get_contents("php://input"));
            
            // Buduj zapytanie UPDATE dynamicznie na podstawie dostarczonych pól
            $fields = [];
            $params = [':id' => $id];
            
            if (isset($data->imie)) {
                $fields[] = "imie = :imie";
                $params[':imie'] = $data->imie;
            }
            
            if (isset($data->nazwisko)) {
                $fields[] = "nazwisko = :nazwisko";
                $params[':nazwisko'] = $data->nazwisko;
            }
            
            if (isset($data->telefon)) {
                $fields[] = "telefon = :telefon";
                $params[':telefon'] = $data->telefon;
            }
            
            if (isset($data->email)) {
                $fields[] = "email = :email";
                $params[':email'] = $data->email;
            }
            
            if (isset($data->adres)) {
                $fields[] = "adres = :adres";
                $params[':adres'] = $data->adres;
            }
            
            if (isset($data->aktywny)) {
                $fields[] = "aktywny = :aktywny";
                $params[':aktywny'] = $data->aktywny ? 1 : 0;
            }
            
            if (empty($fields)) {
                return [
                    'status' => 'error',
                    'message' => 'Brak danych do aktualizacji'
                ];
            }
            
            $query = "UPDATE clients SET " . implode(", ", $fields) . " WHERE id = :id";
            
            $stmt = $this->db->prepare($query);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
            $stmt->execute();
            
            // Pobierz i zwróć zaktualizowanego klienta
            return $this->getById($id);
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Błąd podczas aktualizacji klienta: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Usuń klienta (zmiana flagi aktywny)
     * 
     * @param int $id ID klienta do usunięcia
     * @return array Status operacji
     */
    public function delete($id) {
        try {
            // Sprawdź czy klient istnieje
            $checkQuery = "SELECT id FROM clients WHERE id = :id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();
            
            if ($checkStmt->rowCount() === 0) {
                return [
                    'status' => 'error',
                    'message' => 'Klient o podanym ID nie istnieje'
                ];
            }
            
            // Ustawienie flagi aktywny na 0 (soft delete)
            $query = "UPDATE clients SET aktywny = 0 WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            return [
                'status' => 'success',
                'message' => 'Klient został usunięty'
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Błąd podczas usuwania klienta: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Pobierz historię usług dla danego klienta
     * 
     * @param int $clientId ID klienta
     * @return array Historia usług
     */
    private function getClientServices($clientId) {
        try {
            $query = "SELECT * FROM client_services WHERE client_id = :clientId ORDER BY dataUslugi DESC";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':clientId', $clientId);
            $stmt->execute();
            
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Pobierz informacje o oponach dla każdej usługi
            foreach ($services as &$service) {
                $tireQuery = "SELECT * FROM tire_info WHERE service_id = :serviceId";
                $tireStmt = $this->db->prepare($tireQuery);
                $tireStmt->bindParam(':serviceId', $service['id']);
                $tireStmt->execute();
                
                $service['oponki'] = $tireStmt->fetchAll(PDO::FETCH_ASSOC);
            }
            
            return $services;
        } catch (PDOException $e) {
            return [];
        }
    }

    /**
     * Dodaj nową usługę dla klienta
     * 
     * @param int $clientId ID klienta
     * @return array Dane nowo utworzonej usługi
     */
    public function addService($clientId) {
        try {
            // Sprawdź czy klient istnieje
            $checkQuery = "SELECT id FROM clients WHERE id = :id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':id', $clientId);
            $checkStmt->execute();
            
            if ($checkStmt->rowCount() === 0) {
                return [
                    'status' => 'error',
                    'message' => 'Klient o podanym ID nie istnieje'
                ];
            }
            
            // Pobierz dane z żądania
            $data = json_decode(file_get_contents("php://input"));
            
            // Sprawdź wymagane pola
            if (!isset($data->dataUslugi) || !isset($data->typUslugi) || !isset($data->opis) || !isset($data->cena)) {
                return [
                    'status' => 'error',
                    'message' => 'Brak wymaganych danych usługi'
                ];
            }
            
            // Transakcja do obsługi dodawania usługi i informacji o oponach
            $this->db->beginTransaction();
            
            try {
                // Dodaj usługę
                $query = "INSERT INTO client_services 
                          (client_id, dataUslugi, typUslugi, opis, cena, status) 
                          VALUES (:clientId, :dataUslugi, :typUslugi, :opis, :cena, :status)";
                
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':clientId', $clientId);
                $stmt->bindParam(':dataUslugi', $data->dataUslugi);
                $stmt->bindParam(':typUslugi', $data->typUslugi);
                $stmt->bindParam(':opis', $data->opis);
                $stmt->bindParam(':cena', $data->cena);
                
                $status = 'zakończona';
                $stmt->bindParam(':status', $status);
                
                $stmt->execute();
                
                $serviceId = $this->db->lastInsertId();
                
                // Dodaj informacje o oponach, jeśli są dostępne
                if (isset($data->oponki) && is_array($data->oponki)) {
                    foreach ($data->oponki as $opona) {
                        if (!empty($opona->marka) || !empty($opona->rozmiar) || !empty($opona->stan)) {
                            $tireQuery = "INSERT INTO tire_info 
                                        (service_id, marka, rozmiar, stan) 
                                        VALUES (:serviceId, :marka, :rozmiar, :stan)";
                            
                            $tireStmt = $this->db->prepare($tireQuery);
                            $tireStmt->bindParam(':serviceId', $serviceId);
                            $tireStmt->bindParam(':marka', $opona->marka);
                            $tireStmt->bindParam(':rozmiar', $opona->rozmiar);
                            $tireStmt->bindParam(':stan', $opona->stan);
                            
                            $tireStmt->execute();
                        }
                    }
                }
                
                // Zatwierdź transakcję
                $this->db->commit();
                
                // Pobierz i zwróć nowo utworzoną usługę
                $query = "SELECT * FROM client_services WHERE id = :id";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':id', $serviceId);
                $stmt->execute();
                
                $service = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Pobierz informacje o oponach
                $tireQuery = "SELECT * FROM tire_info WHERE service_id = :serviceId";
                $tireStmt = $this->db->prepare($tireQuery);
                $tireStmt->bindParam(':serviceId', $serviceId);
                $tireStmt->execute();
                
                $service['oponki'] = $tireStmt->fetchAll(PDO::FETCH_ASSOC);
                
                return [
                    'status' => 'success',
                    'data' => $service
                ];
            } catch (PDOException $e) {
                // Wycofaj transakcję w przypadku błędu
                $this->db->rollBack();
                throw $e;
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Błąd podczas dodawania usługi: ' . $e->getMessage()
            ];
        }
    }
}