<?php

/*
 * =============================================
 * Redsys Notification
 * =============================================
 *
 * De momento solo registramos exactamente
 * qué está llegando desde Redsys.
 */

/*=============================================
Datos recibidos por POST
=============================================*/

$postData = $_POST;

/*=============================================
Datos recibidos directamente
=============================================*/

$rawInput = file_get_contents("php://input");

/*=============================================
Guardar información para depuración
=============================================*/

file_put_contents(
    __DIR__ . "/redsys_notify.log",

    "=============================================\n" .
    date("Y-m-d H:i:s") . "\n" .
    "=============================================\n\n" .

    "POST:\n" .
    print_r($postData, true) .
    "\n" .

    "RAW INPUT:\n" .
    $rawInput .
    "\n\n",

    FILE_APPEND
);

/*=============================================
Responder OK a Redsys
=============================================*/

http_response_code(200);

echo "OK";

return;