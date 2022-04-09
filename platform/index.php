<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?> 

<head>
<script src="https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js"></script>
<style>
  #sprite-image {
  height: 325px;
  width: 184px;
  background: url("...link to the above image...")
    0px 0px;
}
</style>
</head>

<body>

</body>

