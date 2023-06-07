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
        die();
    }

    if (isset($_GET['changeId'])) {
        $changeId = $_GET['changeId'];
    } else {
        http_response_code(400);
        echo json_encode(array(
            "error" => "No changeId provided"
        ));
        die();
    }

    // Database Connection
    require("util/connection.php");

    // Query the database
    switch($type) {
        case "Inflow":
            $stmt = mysqli_prepare($conn, " SELECT *, products.name 
                                            FROM inflow 
                                            INNER JOIN products 
                                            ON inflow.product_id = products.id 
                                            WHERE change_id = ?");
            break;
        case "Outflow":
            $stmt = mysqli_prepare($conn, " SELECT *, products.name 
                                            FROM outflow 
                                            INNER JOIN products 
                                            ON outflow.product_id = products.id 
                                            WHERE change_id = ?");
            break;
        case "Inventory":
            $stmt = mysqli_prepare($conn, " SELECT *, products.name 
                                            FROM inventory 
                                            INNER JOIN products 
                                            ON inventory.product_id = products.id 
                                            WHERE change_id = ?");
            break;
        default:
            http_response_code(400);
            echo json_encode(array(
                "error" => "Invalid type provided"
            ));
            die();
    }

    // Bind the parameter
    mysqli_stmt_bind_param($stmt, "i", $changeId);

    // Execute the statement
    mysqli_stmt_execute($stmt);

    // Get the result
    $result = mysqli_stmt_get_result($stmt);

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