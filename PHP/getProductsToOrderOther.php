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

    // Database Connection
    require("util/connection.php");

    // Prepare the statement
    $stmt = mysqli_prepare($conn, " SELECT products.*, vendors.name AS vendor_name
                                    FROM products
                                    INNER JOIN vendors ON products.vendor_id = vendors.id 
                                    WHERE vendor_id 
                                    NOT IN (1, 2) AND stock < minAmount AND active = 1");

    // Execute the statement
    mysqli_stmt_execute($stmt);

    // Get the result
    $result = mysqli_stmt_get_result($stmt);

    // Check for errors
    if (!$result) {
        die("Query failed: " . mysqli_error($conn));
    }

    // Formulate the response
    $products = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $products[] = $row;
    }

    // Close the database connection and statement
    mysqli_stmt_close($stmt);
    mysqli_close($conn);

    // TODO: Send the response
    http_response_code(200);
    echo json_encode($products);

?>