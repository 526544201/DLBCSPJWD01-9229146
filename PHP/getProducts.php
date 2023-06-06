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

    // Check for parameters
    if (isset($_GET['orderby'])) {
        $orderby = $_GET['orderby'];
    } else {
        $orderby = "name";
    }

    // Database Connection
    require("util/connection.php");

    // Query the database
    $query =   "SELECT products.*, vendors.name as vendor_name, vendors.logo as vendor_logo, categories.name as category_name, shelves.name as shelf_name
                FROM products
                INNER JOIN vendors ON products.vendor_id = vendors.id
                INNER JOIN categories ON products.category_id = categories.id
                INNER JOIN shelves ON products.shelf_id = shelves.id
                WHERE products.active = 1
                ORDER BY products.$orderby ASC";
                
    $result = mysqli_query($conn, $query);

    // Check for errors
    if (!$result) {
        die("Query failed: " . mysqli_error($conn));
    }

    // TODO: Formulate the response
    $products = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $products[] = $row;
    }

    // Close the database connection
    mysqli_close($conn);

    // TODO: Send the response
    http_response_code(200);
    echo json_encode($products);

?>