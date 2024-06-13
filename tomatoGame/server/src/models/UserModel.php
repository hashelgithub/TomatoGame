<?php

require_once(__DIR__ . '/../../includes/db.php');

class UserModel {
    
    public function isUsernameUnique($username) {
        global $conn;
        
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();
        $count = $stmt->num_rows;
        $stmt->close();

        return ($count == 0);
    }

    public function registerUser($username, $password) {
        global $conn;

        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $password);

        return $stmt->execute();
    }

    public function getUserByUsername($username) {
        global $conn;

        $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->bind_result($id, $password);
        $stmt->fetch();
        $stmt->close();

        return ($id) ? ['id' => $id, 'password' => $password] : null;
    }
}

?>
