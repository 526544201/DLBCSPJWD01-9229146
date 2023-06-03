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

    // TODO: Add authentication

    // Get payload
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $jsonPayload = json_decode(file_get_contents('php://input'), true);
    } else {
        http_response_code(400);
        die("Bad request method");
    };

    // TODO: Validate payload
    if(!isset($jsonPayload['id'])) {
        http_response_code(400);
        echo json_encode(array(
            "error" => "No id provided"
        ));
        die();
    } else {
        $id = $jsonPayload['id'];
    }

    // Database Connection
    require("util/connection.php");

    // Query the database
    $stmt = mysqli_prepare($conn, "UPDATE products SET active = 0 WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);

    // Execute the statement
    mysqli_stmt_execute($stmt);

    // Get the result
    $result = mysqli_stmt_get_result($stmt);

    // Check if rows were affected
    if(mysqli_affected_rows($conn) == 0){
        // Send status code 404 and error message
        http_response_code(404);
        echo json_encode(array(
            "error" => "Product not found"
        ));
        die();
    }
    // Close the database connection
    mysqli_close($conn);

    // Send the response
    http_response_code(200);
    echo json_encode(array(
        "message" => "Product deleted"
    ));
?>