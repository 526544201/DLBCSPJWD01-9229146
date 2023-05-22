<?php 
    // Set the headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    // Check for preflight request
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        // Send status code 200 and exit
        http_response_code(200);
        exit();
    }

    // TODO: Add authentication

    // TODO: Get payload

    // TODO: Validate payload

    // TODO: Check for parameters

    // Database Connection
    require("util/connection.php");

    // TODO: Query the database

    // Check for errors
    if (!$result) {
        die("Query failed: " . mysqli_error($conn));
    }

    // TODO: Formulate the response

    // Close the database connection
    mysqli_close($conn);

    // TODO: Send the response

?>