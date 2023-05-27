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

    // Get Parameters from GET request
    if (isset($_GET['type'])) {
        $type = $_GET['type'];
    }

    // Database Connection
    require("util/connection.php");

    // Query the database
    if(isset($type)){
        // If type is set, get stockchanges of that type
        $stmt = mysqli_prepare($conn, "SELECT * FROM stockchanges WHERE type = ?");
        mysqli_stmt_bind_param($stmt, "s", $type);
    } else {
        // If type is not set, get all stockchanges
        $stmt = mysqli_prepare($conn, "SELECT * FROM stockchanges");
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