<?php
/**
 * Kontroler panelu głównego
 * 
 * Obsługuje statystyki i dane dla panelu głównego aplikacji
 */
class DashboardController {
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
     * Pobierz podstawowe statystyki dla panelu głównego
     * 
     * @return void
     */
    public function getStats() {
        try {
            // W rzeczywistej aplikacji te dane pobralibyśmy z bazy danych
            // Dla przykładu używamy danych testowych
            
            // Przykład realnego zapytania SQL:
            /*
            // Pobierz liczbę dzisiejszych rezerwacji
            $today = date('Y-m-d');
            $yesterday = date('Y-m-d', strtotime('-1 day'));
            
            $stmt = $this->conn->prepare("SELECT COUNT(*) as count FROM reservations WHERE DATE(date) = ?");
            $stmt->execute([$today]);
            $todayReservations = $stmt->fetch()['count'];
            
            $stmt = $this->conn->prepare("SELECT COUNT(*) as count FROM reservations WHERE DATE(date) = ?");
            $stmt->execute([$yesterday]);
            $yesterdayReservations = $stmt->fetch()['count'];
            */
            
            // Symulacja danych
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
            
            http_response_code(200);
            echo json_encode($stats);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Wystąpił błąd podczas pobierania statystyk',
                'error' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Pobierz dzisiejsze rezerwacje
     * 
     * @return void
     */
    public function getTodayReservations() {
        try {
            // W rzeczywistej aplikacji te dane pobralibyśmy z bazy danych
            // Dla przykładu używamy danych testowych
            
            // Przykład realnego zapytania SQL:
            /*
            $today = date('Y-m-d');
            
            $stmt = $this->conn->prepare("
                SELECT r.id, r.time, r.service_type, r.status, r.notes, 
                c.first_name, c.last_name, c.phone
                FROM reservations r
                JOIN clients c ON r.client_id = c.id
                WHERE DATE(r.date) = ?
                ORDER BY r.time ASC
            ");
            $stmt->execute([$today]);
            
            $reservations = [];
            while ($row = $stmt->fetch()) {
                $reservations[] = [
                    'id' => $row['id'],
                    'time' => $row['time'],
                    'client' => $row['first_name'] . ' ' . $row['last_name'],
                    'service' => $row['service_type'],
                    'status' => $row['status'],
                    'phone' => $row['phone'],
                    'notes' => $row['notes']
                ];
            }
            */
            
            // Symulacja danych
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
            
            http_response_code(200);
            echo json_encode($reservations);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Wystąpił błąd podczas pobierania rezerwacji',
                'error' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Pobierz aktywne alerty
     * 
     * @return void
     */
    public function getAlerts() {
        try {
            // W rzeczywistej aplikacji te dane pobralibyśmy z bazy danych
            // Dla przykładu używamy danych testowych
            
            // Symulacja danych
            $alerts = [
                [
                    'id' => 1,
                    'title' => 'Brak opon zimowych',
                    'message' => 'Niski stan magazynowy opon zimowych 205/55 R16',
                    'type' => 'warning',
                    'created_at' => '2025-03-10 10:15:23'
                ],
                [
                    'id' => 2,
                    'title' => 'Problem z kompresorem',
                    'message' => 'Kompresor w stanowisku 2 wymaga serwisu',
                    'type' => 'error',
                    'created_at' => '2025-03-12 14:30:47'
                ],
                [
                    'id' => 3,
                    'title' => 'Nowa dostawa',
                    'message' => 'Dostawa opon letnich zaplanowana na jutro',
                    'type' => 'info',
                    'created_at' => '2025-03-13 09:45:12'
                ]
            ];
            
            http_response_code(200);
            echo json_encode($alerts);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Wystąpił błąd podczas pobierania alertów',
                'error' => $e->getMessage()
            ]);
        }
    }
}
?>