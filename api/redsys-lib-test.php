<?php
require_once "models/connection.php";
require_once "lib/redsys-lib/autoload.php";

$redsys = Connection::redsys();

echo "<pre>";

echo "Redsys environment: ";
echo !empty($redsys["environment"]) ? "OK" : "VACIO";

echo "\nMerchant Code: ";
echo !empty($redsys["merchantCode"]) ? "OK" : "VACIO";

echo "\nTerminal: ";
echo !empty($redsys["terminal"]) ? "OK" : "VACIO";

echo "\nSecret Key: ";
echo !empty($redsys["secretKey"]) ? "OK" : "VACIO";

echo "\nRedsys API Key: ";
echo !empty($redsys["apiKey"]) ? "OK" : "VACIO";

echo "\n\nLibrería Redsys: OK";

echo "</pre>";