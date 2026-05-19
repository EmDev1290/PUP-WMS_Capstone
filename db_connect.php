<?php

$host = "localhost";
$user = "root";
$password = "";
$database = "pupwms2_db";
$port = 3308;

$conn = mysqli_connect($host, $user, $password, $database, $port);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

?>