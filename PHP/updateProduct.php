<?php 
    // Set the headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Authorization');

    // Check for preflight request
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        // Send status code 200 and exit
        http_response_code(200);
        exit();
    }

    require_once "util/tokenValidator.php";
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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

    // Get payload
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $jsonPayload = json_decode(file_get_contents('php://input'), true);
    } else {
        http_response_code(400);
        die("Bad request method");
    };

    $type;

    // Get values from payload and validate
    if(isset($jsonPayload['id'])) {
        $id = $jsonPayload['id'];
        $type = 'update';
    } else {
        $type = 'add';
    }

    if(isset($jsonPayload['name'])) {
        $name = $jsonPayload['name'];
    } else {
        http_response_code(400);
        echo json_encode(array(
            "message" => "No name provided"
        ));
        die();
    }

    if(isset($jsonPayload['categoryId'])) {
        $categoryId = $jsonPayload['categoryId'];
    } else {
        http_response_code(400);
        echo json_encode(array(
            "message" => "No categoryId provided"
        ));
        die();
    }

    if(isset($jsonPayload['size'])) {
        $size = $jsonPayload['size'];
    } else {
        http_response_code(400);
        echo json_encode(array(
            "message" => "No size provided"
        ));
        die();
    }

    if(isset($jsonPayload['minAmount'])) {
        $minAmount = $jsonPayload['minAmount'];
    } else {
        http_response_code(400);
        echo json_encode(array(
            "message" => "No minAmount provided"
        ));
        die();
    }

    if(isset($jsonPayload['vendorId'])) {
        $vendorId = $jsonPayload['vendorId'];
    } else {
        http_response_code(400);
        echo json_encode(array(
            "message" => "No vendorId provided"
        ));
        die();
    }

    if(isset($jsonPayload['itemNo'])) {
        $itemNo = $jsonPayload['itemNo'];
    } else {
        http_response_code(400);
        echo json_encode(array(
            "message" => "No itemNo provided"
        ));
        die();
    }

    if(isset($jsonPayload['shelfId'])) {
        $shelfId = $jsonPayload['shelfId'];
    } else {
        http_response_code(400);
        echo json_encode(array(
            "message" => "No shelfId provided"
        ));
        die();
    } 

    if(isset($jsonPayload['shelfOrder'])) {
        $shelfOrder = $jsonPayload['shelfOrder'];
    } else {
        http_response_code(400);
        echo json_encode(array(
            "message" => "No shelfOrder provided"
        ));
        die();
    }

    // Database Connection
    require("util/connection.php");

    // Query the database
    if($type == 'add') {
        // Prepare the statement
        $stmt = mysqli_prepare($conn, "INSERT INTO products (`name`, category_id, size, minAmount, vendor_id, item_no_byvendor, shelf_id, shelf_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

        // Bind the parameters
        mysqli_stmt_bind_param($stmt, "siiiiiii", $name, $categoryId, $size, $minAmount, $vendorId, $itemNo, $shelfId, $$shelfOrder);
    } else {
        // Prepare the statement
        $stmt = mysqli_prepare($conn, "UPDATE products SET `name` = ?, category_id = ?, size = ?, minAmount = ?, vendor_id = ?, item_no_byvendor = ?, shelf_id = ?, shelf_order = ? WHERE id = ?");

        // Bind the parameters
        mysqli_stmt_bind_param($stmt, "siiiiiiii", $name, $categoryId, $size, $minAmount, $vendorId, $itemNo, $shelfId, $shelfOrder, $id);
    }

    // Execute the statement
    mysqli_stmt_execute($stmt);

    // Get the result
    $result = mysqli_stmt_get_result($stmt);

    // Send the response
    if(mysqli_affected_rows($conn) == 0) {
        http_response_code(500);
        echo json_encode(array(
            "error" => "Query failed: " . mysqli_error($conn)
        ));
        die();
    } else {
        http_response_code(200);
        if($type == 'add')
            echo json_encode(array(
                "message" => "Product added"
            ));
        else
        {
            echo json_encode(array(
                "message" => "Product updated"
            ));
        }
    }

    // Close the database connection
    mysqli_close($conn);
?>