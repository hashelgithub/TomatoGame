<?php

require_once(__DIR__ . '/../../includes/db.php');
require_once(__DIR__ . '/../models/UserModel.php');

error_reporting(E_ALL);
ini_set('display_errors', 1);

class AuthController {

    public function handleRequest() {
        
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
        header("Access-Control-Max-Age: 86400");

        session_start();

        $payload = file_get_contents('php://input');
        error_log("Received payload: $payload");

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $action = isset($data['action']) ? $data['action'] : null;

            switch ($action) {
                case 'checkAuthentication':
                    return $this->checkAuthentication();
                case 'register':
                    return $this->register(
                        isset($data['username']) ? $data['username'] : null,
                        isset($data['password']) ? $data['password'] : null
                    );
                case 'login':
                    return $this->login(
                        isset($data['username']) ? $data['username'] : null,
                        isset($data['password']) ? $data['password'] : null
                    );
                case 'logout':
                    return $this->logout();
                default:
                    return $this->getResponse("Invalid action", false);
            }
        } else {
            http_response_code(405);
            
            echo json_encode(["message" => "Method Not Allowed", "status" => false]);
            exit();
        }
    }

    private function register($username, $password) {
        $userModel = new UserModel();

        if ($userModel->isUsernameUnique($username)) {
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            if ($userModel->registerUser($username, $hashedPassword)) {
                return $this->getResponse("Registration successful", true);
            } else {
                return $this->getResponse("Error during registration", false);
            }
        } else {
            return $this->getResponse("Username already exists", false);
        }
    }

    private function login($username, $password) {
        $userModel = new UserModel();

        $userData = $userModel->getUserByUsername($username);

        if ($userData && password_verify($password, $userData['password'])) {
            $_SESSION['user_id'] = $userData['id'];

            $cookieName = 'user_id';
            $cookieValue = $userData['id'];
            $cookieExpiration = time() + 3600;
            $cookiePath = '/';
            setcookie($cookieName, $cookieValue, $cookieExpiration, $cookiePath);

            return $this->getResponse("Login successful", true);
        } else {
            return $this->getResponse("Invalid username or password", false);
        }
    }

    function logout() {

        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['status' => false, 'message' => 'User not authenticated']);
            exit();
        }

        session_unset();
        session_destroy();
    
        setcookie('user_id', '', time() - 3600, '/');
    
        echo json_encode(['status' => true, 'message' => 'Logout successful']);
        exit();
    }

    private function checkAuthentication() {
        if (!isset($_COOKIE['user_id'])) {
            echo json_encode(['status' => false, 'message' => 'User not authenticated']);
            exit();
        }
    
        echo json_encode(['status' => true, 'message' => 'User authenticated']);
        exit();
    }    
    

    private function getResponse($message, $status) {
        return ['message' => $message, 'status' => $status, 'data'];
    }
}

$authController = new AuthController();
$response = $authController->handleRequest();

echo json_encode($response);
?>
