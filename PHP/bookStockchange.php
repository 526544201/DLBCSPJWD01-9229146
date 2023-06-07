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

    // Get values from payload TODO: Validate
    $requestId = $jsonPayload["requestId"];
    $type = $jsonPayload["type"];
    $data = $jsonPayload["data"];
    $date = $jsonPayload["date"];

    // Database Connection
    require("util/connection.php");

    // Check if requestId already exists
    // Prepare the statement
    $stmt = mysqli_prepare($conn, "SELECT * FROM stockchanges WHERE request_id = ?");

    // Bind the parameter
    mysqli_stmt_bind_param($stmt, "s", $requestId);

    // Execute the statement
    mysqli_stmt_execute($stmt);

    // Get the result
    $result = mysqli_stmt_get_result($stmt);

    // Check for errors
    if (!$result) {
        die("Query failed: " . mysqli_error($conn));
    }

    // Check if the requestId already exists
    if(mysqli_num_rows($result) > 0){
        // Send status code 202 and debug message for demonstration purposes
        http_response_code(202);
        echo json_encode(array(
            "message" => "Request already exists"
        ));
        die();
    }

    // Prepare the statement
    $stmt = mysqli_prepare($conn, "INSERT INTO stockchanges (request_id, `type`, `date`) VALUES (?, ?, ?)");

    // Bind parameters
    mysqli_stmt_bind_param($stmt, "sss", $requestId, $type, $date);

    // Execute the statement
    mysqli_stmt_execute($stmt);

    // Get the result
    $result = mysqli_stmt_get_result($stmt);

    // Get the id of the inserted row
    $stockChangeId = mysqli_insert_id($conn);

    // Loop through the data
    foreach($data as $product){

        // Get the old stock
        $query = "SELECT stock FROM products WHERE id = " . $product["productId"];
        $result = mysqli_query($conn, $query);
        $row = mysqli_fetch_assoc($result);
        $oldStock = $row["stock"];

        // Calculate the new stock
        switch($type) {
            case "Inflow":
                $newStock = $oldStock + $product["quantity"];
                $quantity = $product["quantity"];
                break;
            case "Outflow":
                $newStock = $oldStock - $product["quantity"];
                $quantity = $product["quantity"];
                break;
            case "Inventory":
                $newStock = $product["quantity"];
                $quantity = $product["quantity"] - $oldStock;
                break;
        }

        // Prepare the statements
        switch($type) {
            case "Inflow":
                $stmt = mysqli_prepare($conn, "INSERT INTO inflow (change_id, product_id, quantity, old_Stock, new_Stock) VALUES (?, ?, ?, ?, ?)");
                $stmt2 = mysqli_prepare($conn, "UPDATE products SET stock = ? WHERE id = ?");
                break;
            case "Outflow":
                $stmt = mysqli_prepare($conn, "INSERT INTO outflow (change_id, product_id, quantity, old_Stock, new_Stock) VALUES (?, ?, ?, ?, ?)");
                $stmt2 = mysqli_prepare($conn, "UPDATE products SET stock = ? WHERE id = ?");
                break;
            case "Inventory":
                $stmt = mysqli_prepare($conn, "INSERT INTO inventory (change_id, product_id, quantity, old_Stock, new_Stock) VALUES (?, ?, ?, ?, ?)");
                $stmt2 = mysqli_prepare($conn, "UPDATE products SET stock = ? WHERE id = ?");
                break;
        }
        // Bind parameters
        mysqli_stmt_bind_param($stmt, "siiii", $stockChangeId, $product["productId"], $quantity, $oldStock, $newStock);
        mysqli_stmt_bind_param($stmt2, "ii", $newStock, $product["productId"]);

        // Execute the statements
        mysqli_stmt_execute($stmt);
        mysqli_stmt_execute($stmt2);

        // Get the results
        $result = mysqli_stmt_get_result($stmt);
        $result2 = mysqli_stmt_get_result($stmt2);
    }

    // Close the database connection
    mysqli_close($conn);

    // Send response
    http_response_code(200);  
    echo json_encode(array(
        "message" => "Successfully updated!"
    )); 
?>