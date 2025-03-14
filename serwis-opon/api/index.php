<?php
/**
 * Główny plik wejściowy dla API aplikacji Serwis Opon
 * 
 * Ten plik działa jako router dla wszystkich zapytań API,
 * kierując je do odpowiednich kontrolerów na podstawie URL.
 */

// Ustaw nagłówki CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Obsługa preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Dołącz plik konfiguracyjny bazy danych
require_once 'config/database.php';

// Utwórz instancję bazy danych
$database = new Database();
$db = $database->getConnection();

// Pobierz ścieżkę zapytania z URL
$request_uri = $_SERVER['REQUEST_URI'];
$base_path = '/serwis-opon/api'; // Dostosuj do swojej ścieżki bazowej

// Usuń ścieżkę bazową aby otrzymać tylko endpoint API
$endpoint = str_replace($base_path, '', $request_uri);
$endpoint = trim($endpoint, '/');

// Podziel endpoint na części
$endpoint_parts = explode('/', $endpoint);

// Utwórz prosty router API
$controller = $endpoint_parts[0] ?? '';
$id = $endpoint_parts[1] ?? null;
$action = $endpoint_parts[2] ?? null;

// Mapowanie URL na odpowiednie kontrolery
switch ($controller) {
    case 'auth':
        // Obsługa uwierzytelniania
        require_once 'controllers/AuthController.php';
        $controller = new AuthController($db);
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if ($id === 'login') {
                // Implementacja logiki logowania
                $data = json_decode(file_get_contents("php://input"));
                
                // Symulacja logowania - w rzeczywistej aplikacji weryfikowalibyśmy z bazą danych
                if ($data && isset($data->username) && isset($data->password)) {
                    if ($data->username === 'admin' && $data->password === 'admin123') {
                        // Wygeneruj token JWT (w rzeczywistej aplikacji)
                        $response = [
                            'status' => 'success',
                            'message' => 'Zalogowano pomyślnie',
                            'token' => 'sample_jwt_token_here',
                            'user' => [
                                'id' => 1,
                                'username' => 'admin',
                                'name' => 'Adam Nowak',
                                'role' => 'admin'
                            ]
                        ];
                        http_response_code(200);
                    } else {
                        $response = [
                            'status' => 'error',
                            'message' => 'Nieprawidłowa nazwa użytkownika lub hasło'
                        ];
                        http_response_code(401);
                    }
                } else {
                    $response = [
                        'status' => 'error',
                        'message' => 'Brak danych uwierzytelniających'
                    ];
                    http_response_code(400);
                }
                
                echo json_encode($response);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Endpoint nie znaleziony']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['message' => 'Metoda niedozwolona']);
        }
        break;
        
    case 'dashboard':
        // Obsługa dashboardu
        if ($id === 'stats') {
            // Zwróć statystyki dla dashboardu
            $stats = [
                'reservations' => [
                    'today' => 8,
                    'yesterday' => 6,
                    'change' => 2
                ],
                'storage' => [
                    'tires' => 152,
                    'capacity' => 200,
                    'capacityPercentage' => 76
                ],
                'clients' => [
                    'total' => 287,
                    'newThisMonth' => 14
                ],
                'alerts' => 3
            ];
            
            echo json_encode($stats);
        } elseif ($id === 'today-reservations') {
            // Zwróć dzisiejsze rezerwacje
            $reservations = [
                [
                    'id' => 1,
                    'time' => '08:00',
                    'client' => 'Jan Kowalski',
                    'service' => 'Wymiana opon (4 szt.)',
                    'status' => 'completed'
                ],
                [
                    'id' => 2,
                    'time' => '09:30',
                    'client' => 'Anna Nowak',
                    'service' => 'Przechowanie opon (4 szt.)',
                    'status' => 'in_progress'
                ],
                [
                    'id' => 3,
                    'time' => '11:00',
                    'client' => 'Piotr Wiśniewski',
                    'service' => 'Wymiana + wyważanie (4 szt.)',
                    'status' => 'pending'
                ],
                [
                    'id' => 4,
                    'time' => '13:30',
                    'client' => 'Katarzyna Lewandowska',
                    'service' => 'Naprawa opony',
                    'status' => 'pending'
                ],
                [
                    'id' => 5,
                    'time' => '15:00',
                    'client' => 'Michał Kaczmarek',
                    'service' => 'Odbiór opon z przechowalni',
                    'status' => 'planned'
                ]
            ];
            
            echo json_encode($reservations);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint nie znaleziony']);
        }
        break;
        
    case 'settings':
        // Obsługa ustawień
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Pobierz ustawienia
            $settings = [
                'company' => [
                    'companyName' => 'Serwis Opon',
                    'address' => 'ul. Przykładowa 123',
                    'postalCode' => '00-000',
                    'city' => 'Warszawa',
                    'nip' => '1234567890',
                    'email' => 'kontakt@serwisopon.pl',
                    'phone' => '123 456 789',
                    'website' => 'www.serwisopon.pl'
                ],
                'system' => [
                    'autoBackup' => true,
                    'backupInterval' => 'daily',
                    'backupLocation' => 'local',
                    'language' => 'pl',
                    'theme' => 'light',
                    'currency' => 'PLN',
                    'vatRate' => '23'
                ]
            ];
            
            echo json_encode($settings);
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
            // Aktualizuj ustawienia
            $data = json_decode(file_get_contents("php://input"));
            
            // W rzeczywistej aplikacji zapisalibyśmy dane do bazy
            
            http_response_code(200);
            echo json_encode(['message' => 'Ustawienia zaktualizowane pomyślnie']);
        } else {
            http_response_code(405);
            echo json_encode(['message' => 'Metoda niedozwolona']);
        }
        break;
        
    default:
        // Obsługa nieznanego endpointu
        http_response_code(404);
        echo json_encode(['message' => 'Endpoint nie znaleziony']);
        break;
}
?>