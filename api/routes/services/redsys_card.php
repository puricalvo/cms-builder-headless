<?php

require_once "models/connection.php";
require_once "lib/redsys-lib/autoload.php";

/*=============================================
MÉTODO
=============================================*/

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "status" => 405,
        "results" => "Method Not Allowed"
    ]);

    return;
}

/*=============================================
RECIBIR DATOS
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
DATOS DE LA TARJETA
=============================================*/

$amount = $input["amount"] ?? null;

$cardNumber = preg_replace(
    '/\D+/',
    '',
    (string) ($input["cardNumber"] ?? "")
);

$expiryDate = preg_replace(
    '/\D+/',
    '',
    (string) ($input["expiryDate"] ?? "")
);

$cvv = preg_replace(
    '/\D+/',
    '',
    (string) ($input["cvv"] ?? "")
);

$browserEmv3ds = $input["emv3ds"] ?? null;


/*=============================================
VALIDAR DATOS
=============================================*/

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

if (
    empty($cardNumber) ||
    empty($expiryDate) ||
    empty($cvv) ||
    !is_array($browserEmv3ds)
) {

    echo json_encode([
        "status" => 400,
        "results" => "Card number, expiry date, cvv and emv3ds are required"
    ]);

    return;
}


/*=============================================
FECHA DE CADUCIDAD
=============================================*/

if (strlen($expiryDate) !== 4) {

    echo json_encode([
        "status" => 400,
        "results" => "Expiry date must be in MMYY format"
    ]);

    return;
}

$month = substr($expiryDate, 0, 2);
$year = substr($expiryDate, 2, 2);

if (
    (int) $month < 1 ||
    (int) $month > 12
) {

    echo json_encode([
        "status" => 400,
        "results" => "Invalid expiry month"
    ]);

    return;
}

/*
 * Frontend:
 * 12/49
 *
 * Redsys:
 * 4912
 */

$expiryDate = $year . $month;


/*=============================================
CONFIGURACIÓN REDSYS
=============================================*/

$redsys = Connection::redsys();

if (empty($redsys["apiKey"])) {

    echo json_encode([
        "status" => 500,
        "results" => "Redsys API Key is not configured"
    ]);

    return;
}


/*=============================================
MERCHANT
=============================================*/

try {

    $merchant = \Redsys\Merchant::initWithApiKey(
        $redsys["apiKey"]
    );

} catch (Throwable $e) {

    echo json_encode([
        "status" => 500,
        "results" => "Error initializing Redsys",
        "error" => $e->getMessage()
    ]);

    return;
}

if (!$merchant) {

    echo json_encode([
        "status" => 500,
        "results" => "Invalid Redsys API Key"
    ]);

    return;
}


/*=============================================
PRIMERA PETICIÓN - INIT
=============================================*/

$params = new \Redsys\Parameters();

$params->DS_MERCHANT_AMOUNT =
    (string) ((int) $amount);

$params->DS_MERCHANT_ORDER =
    (string) time();

$params->DS_MERCHANT_PAN =
    $cardNumber;

$params->DS_MERCHANT_EXPIRYDATE =
    $expiryDate;

$params->DS_MERCHANT_CVV2 =
    $cvv;


/*=============================================
INIT REDSYS
=============================================*/

try {

    $response = \Redsys\Rest::genericInit(
        $merchant,
        $params,
        "0"
    );

} catch (Throwable $e) {

    echo json_encode([
        "status" => 500,
        "results" => "Error processing Redsys INIT",
        "error" => $e->getMessage()
    ]);

    return;
}


/*=============================================
ERROR INIT
=============================================*/

if (!empty($response->errorCode)) {

    header(
        "Content-Type: application/json; charset=utf-8"
    );

    echo json_encode($response);

    return;
}


/*=============================================
DATOS EMV3DS DE REDSYS
=============================================*/

$data = $response->data ?? null;

if (!$data) {

    echo json_encode([
        "status" => 500,
        "results" => "Redsys INIT did not return data"
    ]);

    return;
}

$receivedEmv3ds =
    $data->emv3ds ?? null;

if (!$receivedEmv3ds) {

    echo json_encode([
        "status" => 500,
        "results" => "Redsys did not return EMV3DS data"
    ]);

    return;
}


/*=============================================
DATOS DE LA OPERACIÓN
=============================================*/

$order =
    $params->DS_MERCHANT_ORDER;

$transactionType = "0";

$protocolVersion =
    $receivedEmv3ds["protocolVersion"]
    ?? $receivedEmv3ds->protocolVersion
    ?? "";


/*=============================================
URL CHALLENGE RESPONSE
=============================================*/

/*
 * Redsys volverá a esta URL cuando termine
 * el Challenge.
 *
 * Añadimos los datos necesarios para que
 * redsys_challenge.php pueda finalizar
 * correctamente la operación.
 */

$notificationUrl =
    "http://cms-builder-headless-api.com"
    . "/routes/services/redsys_challenge.php"
    . "?order=" . urlencode($order)
    . "&protocolVersion=" . urlencode($protocolVersion)
    . "&transactionType=" . urlencode($transactionType)
    . "&amount=" . urlencode((string) ((int) $amount));


/*=============================================
SEGUNDA PETICIÓN - AUTORIZACIÓN
=============================================*/

$params->DS_MERCHANT_MERCHANTURL =
    "http://cms-builder-headless-api.com"
    . "/routes/services/redsys_notify.php";


/*=============================================
EMV3DS
=============================================*/

$emv3ds =
    $data->DS_EMV3DS ?? [];

if (is_object($emv3ds)) {

    $emv3ds = (array) $emv3ds;
}

$emv3ds["threeDSInfo"] =
    "AuthenticationData";

$emv3ds["notificationURL"] =
    $notificationUrl;

$emv3ds["browserAcceptHeader"] =
    $_SERVER["HTTP_ACCEPT"] ?? "*/*";


/*=============================================
DATOS DEL NAVEGADOR
=============================================*/

$emv3ds = array_merge(
    $emv3ds,
    $browserEmv3ds
);


/*=============================================
EMV3DS FINAL
=============================================*/

$params->DS_MERCHANT_EMV3DS =
    $emv3ds;


/*=============================================
AUTORIZACIÓN
=============================================*/

try {

    $response2 = \Redsys\Rest::generic(
        $merchant,
        $params,
        "0"
    );

} catch (Throwable $e) {

    echo json_encode([
        "status" => 500,
        "results" => "Error processing Redsys authorization",
        "error" => $e->getMessage()
    ]);

    return;
}


/*=============================================
CHALLENGE 3DS
=============================================*/

if (
    (
        empty($response2->data->DS_RESPONSE) ||
        $response2->data->DS_RESPONSE != "0000"
    )
    &&
    !empty($response2->data->DS_EMV3DS)
) {

    $challenge =
        \Redsys\GenerateRedirectForm::challenge(
            $merchant,
            $response2->data
        );

    $response2Array =
        json_decode(
            json_encode($response2),
            true
        );

    $response2Array["challenge"] =
        $challenge;

    $response2 =
        $response2Array;
}


/*=============================================
RESPUESTA
=============================================*/

header(
    "Content-Type: application/json; charset=utf-8"
);

echo json_encode($response2);

return;