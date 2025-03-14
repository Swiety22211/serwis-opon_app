<?php
/**
 * Kontroler uwierzytelniania
 * 
 * Obsługuje logowanie, rejestrację i zarządzanie użytkownikami
 */
class AuthController {
    // Połączenie z bazą danych
    private $conn;
    
    /**
     * Konstruktor
     * 
     * @param PDO $db Połączenie z bazą danych
     */
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Logowanie użytkownika
     * 
     * @return void
     */
    public function login() {
        // Pobierz dane z zapytania
        $data = json_decode(file_get_contents("php://input"));
        
        // Sprawdź czy wymagane pola są dostępne
        if (!$data || !isset($data->username) || !isset($data->password)) {
            http_response_code(400);
            echo json_encode(['message' => 'Brak wymaganych danych']);
            return;
        }
        
        // W rzeczywistej aplikacji sprawdzilibyśmy dane w bazie danych
        // Tutaj dla uproszczenia używamy hardcoded credentials
        if ($data->username === 'admin' && $data->password === 'admin123') {
            // W rzeczywistej aplikacji wygenerowalibyśmy token JWT
            $token = 'sample_jwt_token_' . time();
            
            // Przygotuj odpowiedź
            $response = [
                'status' => 'success',
                'message' => 'Zalogowano pomyślnie',
                'token' => $token,
                'user' => [
                    'id' => 1,
                    'username' => 'admin',
                    'name' => 'Adam Nowak',
                    'role' => 'admin'
                ]
            ];
            
            http_response_code(200);
        } else {
            // Nieprawidłowe dane logowania
            $response = [
                'status' => 'error',
                'message' => 'Nieprawidłowa nazwa użytkownika lub hasło'
            ];
            
            http_response_code(401);
        }
        
        // Zwróć odpowiedź
        echo json_encode($response);
    }
    
    /**
     * Wylogowanie użytkownika
     * 
     * @return void
     */
    public function logout() {
        // W przypadku JWT wystarczy usunąć token po stronie klienta
        // Tu możemy zaimplementować dodatkową logikę, np. dodanie tokenu do czarnej listy
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Wylogowano pomyślnie'
        ]);
    }
    
    /**
     * Sprawdzenie ważności tokenu
     * 
     * @return void
     */
    public function validateToken() {
        // Pobierz token z nagłówka
        $headers = getallheaders();
        $auth_header = $headers['Authorization'] ?? '';
        
        if (empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
            http_response_code(401);
            echo json_encode(['message' => 'Brak lub nieprawidłowy token autoryzacyjny']);
            return;
        }
        
        $token = $matches[1];
        
        // W rzeczywistej aplikacji zweryfikowalibyśmy token JWT
        // Dla demonstracji zakładamy, że token jest prawidłowy
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Token jest ważny',
            'user' => [
                'id' => 1,
                'username' => 'admin',
                'name' => 'Adam Nowak',
                'role' => 'admin'
            ]
        ]);
    }
    
    /**
     * Zmiana hasła użytkownika
     * 
     * @return void
     */
    public function changePassword() {
        // Pobierz dane z zapytania
        $data = json_decode(file_get_contents("php://input"));
        
        // Sprawdź czy wymagane pola są dostępne
        if (!$data || !isset($data->currentPassword) || !isset($data->newPassword) || !isset($data->confirmPassword)) {
            http_response_code(400);
            echo json_encode(['message' => 'Brak wymaganych danych']);
            return;
        }
        
        // Sprawdź czy nowe hasło i potwierdzenie są identyczne
        if ($data->newPassword !== $data->confirmPassword) {
            http_response_code(400);
            echo json_encode(['message' => 'Nowe hasło i potwierdzenie nie są identyczne']);
            return;
        }
        
        // W rzeczywistej aplikacji zweryfikowalibyśmy obecne hasło i zapisalibyśmy nowe
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Hasło zostało zmienione pomyślnie'
        ]);
    }
}
?>