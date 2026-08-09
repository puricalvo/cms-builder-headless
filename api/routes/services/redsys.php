<?php

require_once "models/connection.php";
require_once "lib/redsys-lib/autoload.php";

/*=============================================
Método permitido
=============================================*/

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "status" => 405,
        "results" => "Method Not Allowed"
    ]);

    return;

}

/*=============================================
Obtener configuración Redsys
=============================================*/

$redsys = Connection::redsys();

/*=============================================
Validar API Key
=============================================*/

if (empty($redsys["apiKey"])) {

    echo json_encode([
        "status" => 500,
        "results" => "Redsys API Key is not configured"
    ]);

    return;

}

/*=============================================
Recibir datos
=============================================*/

$input = json_decode(
    file_get_contents("php://input"),
    true
);

if (!is_array($input)) {

    echo json_encode([
        "status" => 400,
        "results" => "Invalid JSON"
    ]);

    return;

}

/*=============================================
Obtener importe
=============================================*/

/*
 * El frontend envía el importe en céntimos.
 *
 * 1,00 € = 100
 * 5,50 € = 550
 */

$amount = $input["amount"] ?? null;

if (
    !is_numeric($amount) ||
    (int) $amount <= 0
) {

    echo json_encode([
        "status" => 400,
        "results" => "Amount required"
    ]);

    return;

}

$amount = (int) $amount;

/*=============================================
Inicializar Redsys
=============================================*/

try {

    $merchant = \Redsys\Merchant::initWithApiKey(
        $redsys["apiKey"]
    );

} catch (Throwable $e) {

    echo json_encode([
        "status" => 500,
        "results" => "Error initializing Redsys"
    ]);

    return;

}

/*=============================================
Validar Merchant
=============================================*/

if (!$merchant) {

    echo json_encode([
        "status" => 500,
        "results" => "Invalid Redsys API Key"
    ]);

    return;

}

/*=============================================
Crear parámetros
=============================================*/

$params = new \Redsys\Parameters();

/*=============================================
Importe
=============================================*/

$params->amount = $amount;

/*
 * Para esta prueba utilizamos timestamp.
 */

$params->order = (string) time();

/*=============================================
Tipo de operación
=============================================*/

$params->transactionType = "0";

/*=============================================
URLs de retorno de Redsys
=============================================*/

$params->merchantUrl =
    "http://cms-builder-headless-api.com/routes/services/redsys_notify.php";

$params->urlOk =
    "http://localhost:4321/order/pricecafe";

$params->urlKo =
    "http://localhost:4321/order/pricecafe";

/*=============================================
Generar redirección Redsys
=============================================*/

try {

    \Redsys\Redirect::authorisation(
        $merchant,
        $params
    );

} catch (Throwable $e) {

    echo json_encode([
        "status" => 500,
        "results" => "Error generating Redsys payment"
    ]);

    return;

}

return;
?>