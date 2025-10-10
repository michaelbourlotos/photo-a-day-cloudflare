<?php
// Data Export Script for Photo A Day Migration
// Run this on your Hostinger server to export photo data

// Database connection (update with your actual credentials)
$servername = "localhost";
$username = "u708822530_michael";
$password = "Rolodex$1";
$dbname = "u708822530_images";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Export photos data
$sql = "SELECT datePhotos, fileFullNamePhotos, orderPhotos, titlePhotos FROM photos ORDER BY orderPhotos";
$result = mysqli_query($conn, $sql);

if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}

echo "-- Photo A Day Data Export\n";
echo "-- Generated on: " . date('Y-m-d H:i:s') . "\n\n";

echo "INSERT INTO photos (datePhotos, fileFullNamePhotos, orderPhotos, titlePhotos) VALUES\n";

$rows = [];
while ($row = mysqli_fetch_assoc($result)) {
    $date = mysqli_real_escape_string($conn, $row['datePhotos']);
    $filename = mysqli_real_escape_string($conn, $row['fileFullNamePhotos']);
    $order = intval($row['orderPhotos']);
    $title = mysqli_real_escape_string($conn, $row['titlePhotos']);
    
    $rows[] = "('$date', '$filename', $order, '$title')";
}

echo implode(",\n", $rows) . ";\n\n";

echo "-- Total photos: " . count($rows) . "\n";
echo "-- Files to upload to R2:\n";

// List all files that need to be uploaded
$uploadDir = './uploads/';
if (is_dir($uploadDir)) {
    $files = scandir($uploadDir);
    foreach ($files as $file) {
        if ($file != '.' && $file != '..' && preg_match('/\.(jpg|jpeg|png)$/i', $file)) {
            echo "-- $file\n";
        }
    }
}

mysqli_close($conn);
?>
