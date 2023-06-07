<?php 
    // Set the headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    // Check for preflight request
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        // Send status code 200 and exit
        http_response_code(200);
        exit();
    }

    // Get the payload
    $payload = json_decode(file_get_contents('php://input'), true);

    // Validate payload
    if (!isset($payload['email']) || !isset($payload['password'])) {
        // Send status code 400 and exit
        http_response_code(400);
        exit();
    }

    $payload = json_decode(file_get_contents('php://input'), true);

    // Load JWT library
    require_once('util/php-jwt-main/src/JWT.php'); 

    // Import JWT class
    use \Firebase\JWT\JWT; 

    // Database Connection
    require('util/connection.php');

    // Query for user
    $query = "SELECT * FROM users WHERE email = '" . $payload['email'] . "'";
    $result = mysqli_query($conn, $query);

    // Check for errors
    if (!$result) {
        die("Query failed: " . mysqli_error($conn));
    }

    // Check if user does not exists
    if (mysqli_num_rows($result) == 0) {
        // Send status code 401 and exit
        http_response_code(401);
        echo json_encode(array('message' => 'Incorrect user/password'));
        exit();
    }

    // Get the user
    $user = mysqli_fetch_assoc($result);
    
    // Check if password is incorrect
    if (!password_verify($payload['password'], $user['password'])) {
        // Send status code 401 and exit
        http_response_code(401);
        echo json_encode(array('message' => 'Incorrect user/password'));
        exit();
    }

    // Close the database connection
    mysqli_close($conn);

    // Create a JWT
    $secretKey = 'czc$Mr#gfnSGCFgbdLpjyY$Ym@7@6K8L';
    $token = array(
        'iss' => 'localhost',
        'aud' => 'localhost',
        'iat' => time(),
        'exp' => time() + (60 * 60),
        'sub' => $user['id']
    );
    $jwt = JWT::encode($token, $secretKey, 'HS256');

    // Formulate the response
    http_response_code(200);
    echo json_encode(array('token' => $jwt, 'userId' => $token['sub'], 'tokenExpires' => $token['exp'], 'username' => $user['username']));
?>