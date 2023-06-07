<?php 
    // Set the headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Authorization');

    // Check for preflight request
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        // Send status code 200 and exit
        http_response_code(200);
        exit();
    }

    require_once "util/tokenValidator.php";

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Check if the Authorization header is set
        if (isset($_SERVER['HTTP_X_AUTHORIZATION'])) {
            // Extract the token from the header
            $authHeader = $_SERVER['HTTP_X_AUTHORIZATION'];
    
            // Split the header to separate the "Bearer" keyword and the token
            $headerParts = explode(' ', $authHeader);
    
            // Check if the header format is correct
            if (count($headerParts) === 2 && $headerParts[0] === 'Bearer') {
                // The token is in the second part of the header
                $jwtToken = trim($headerParts[1], '"');
    
                validateToken($jwtToken);
    
            } else {
                // Invalid header format
                http_response_code(400);
                echo json_encode(array( 
                    "message" => "Invalid authorization header format." 
                ));
                exit();
            }
        } else {
            // Authorization header is missing
            http_response_code(401);
            echo json_encode(array( 
                "message" => "Authorization header is missing." 
            ));
            exit();
        }
    } else {
        // Handle other HTTP methods if needed
        http_response_code(405);
        echo json_encode(array( 
            "message" => "Method not allowed." 
        ));
        exit();
    }

    // Get Parameters from GET request
    if (isset($_GET['type'])) {
        $type = $_GET['type'];
    } else {
        http_response_code(400);
        echo json_encode(array(
            "error" => "No type provided"
        ));
    }

    // Database Connection
    require("util/connection.php");

    // Query the database
    if($type == "All"){      
        $stmt = mysqli_prepare($conn, "SELECT * FROM stockchanges ORDER BY date DESC");

    } else {
        // If type is set, get all stockchanges
        $stmt = mysqli_prepare($conn, "SELECT * FROM stockchanges WHERE type = ? ORDER BY date DESC");
        mysqli_stmt_bind_param($stmt, "s", $type);
    }

    // Execute the statement
    mysqli_stmt_execute($stmt);

    // Get the result
    $result = mysqli_stmt_get_result($stmt);

    // Check for errors
    if (!$result) {
        http_response_code(500);
        echo json_encode(array(
            "error" => "Query failed: " . mysqli_error($conn)
        ));
        die();
    }

    // Formulate the response
    $stockchanges = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $stockchanges[] = $row;
    }

    // Close the database connection
    mysqli_close($conn);

    // Send the response
    http_response_code(200);
    echo json_encode($stockchanges);

?>