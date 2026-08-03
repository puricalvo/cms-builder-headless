<?php

require_once __DIR__."/../extensions/vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__."/..");
$dotenv->load();

?>