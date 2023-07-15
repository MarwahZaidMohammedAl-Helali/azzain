<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "file_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Define the target directory for file uploads
$targetDir = "uploads/";

// Check if files were uploaded
if (isset($_FILES['files'])) {
    $uploadedFiles = $_FILES['files'];

    // Loop through each uploaded file
    for ($i = 0; $i < count($uploadedFiles['name']); $i++) {
        $fileName = $uploadedFiles['name'][$i];
        $tempPath = $uploadedFiles['tmp_name'][$i];
        $targetPath = $targetDir . basename($fileName);

        // Move the file to the target directory
        if (move_uploaded_file($tempPath, $targetPath)) {
            // If the file was moved successfully, insert a new record in the database
            $sql = "INSERT INTO files (user_id, file_name, file_path) VALUES (1, '$fileName', '$targetPath')";

            // Execute the SQL query
            if ($conn->query($sql) === TRUE) {
                echo "Files uploaded successfully.";
            } else {
                echo "Error inserting record: " . $conn->error;
            }
        } else {
            echo "Error moving file to target directory.";
        }
    }
} else {
    echo "No files were uploaded.";
}

// Close the database connection
$conn->close();
?>