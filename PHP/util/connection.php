<?php 
    // Connect to the database
    $host_name = 'localhost';
    $database = 'javaportfolio';
    $user_name = 'root';
    $password = '123456';

    $conn = mysqli_connect($host_name, $user_name, $password, $database);

    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }            

?>