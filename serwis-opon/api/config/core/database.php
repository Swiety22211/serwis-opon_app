<?php
/**
 * Klasa konfiguracji bazy danych
 * 
 * Obsługuje połączenie z bazą danych MySQL dla aplikacji Serwis Opon
 */
class Database {
    // Parametry połączenia z bazą danych
    private $host = "localhost";
    private $db_name = "serwis_opon";
    private $username = "root";
    private $password = "";
    public $conn;
    
    /**
     * Uzyskaj połączenie z bazą danych
     * 
     * @return PDO Obiekt połączenia PDO lub null w przypadku błędu
     */
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8",
                $this->username,
                $this->password
            );
            
            // Ustaw tryb błędów PDO na wyjątki
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Ustaw domyślny fetch mode na asocjacyjny
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
        } catch (PDOException $exception) {
            // Zapisz błąd do logów i zwróć null
            error_log("Błąd połączenia z bazą danych: " . $exception->getMessage());
            
            // Jeśli jesteśmy w trybie deweloperskim, możemy pokazać błąd
            if (getenv('APP_ENV') === 'development') {
                echo "Błąd połączenia z bazą danych: " . $exception->getMessage();
            }
        }
        
        return $this->conn;
    }
}
?>