<?php

require_once __DIR__ . "/../../vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(
    __DIR__ . "/../.."
);

$dotenv->load();

$rawInput = file_get_contents("php://input");

require_once __DIR__ . "/../../models/connection.php";
require_once __DIR__ . "/../../lib/redsys-lib/autoload.php";

/*=============================================
RECIBIR DATOS
=============================================*/

$jsonParams = json_decode(
    $rawInput,
    true
);

$receivedParams = array_merge(
    $_GET,
    $_POST,
    is_array($jsonParams) ? $jsonParams : []
);


/*=============================================
VALIDAR CRES
=============================================*/

if (empty($receivedParams["cres"])) {

    header(
        "Location: http://localhost:4321/order/pricecafe"
    );

    return;
}


/*=============================================
CONFIGURACIÓN REDSYS
=============================================*/

$redsys = Connection::redsys();

if (empty($redsys["apiKey"])) {

    header(
        "Location: http://localhost:4321/order/pricecafe"
    );

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

    header(
        "Location: http://localhost:4321/order/pricecafe"
    );

    return;
}


/*=============================================
PARÁMETROS CHALLENGE RESPONSE
=============================================*/

$params = new \Redsys\Parameters();

$params->order =
    $receivedParams["order"] ?? "";

$params->emv3ds = [

    "protocolVersion" =>
        $receivedParams["protocolVersion"] ?? "",

    "cres" =>
        $receivedParams["cres"],

    "threeDSInfo" =>
        "ChallengeResponse"
];


/*=============================================
ENVIAR CRES A REDSYS
=============================================*/

try {

    $response =
        \Redsys\Rest::challengeResponse(
            $merchant,
            $params
        );

} catch (Throwable $e) {

    header(
        "Location: http://localhost:4321/order/pricecafe"
    );

    return;
}


/*=============================================
RESULTADO
=============================================*/

if (!empty($response)) {

    $codResponse =
        $response->data->codResponse ?? "";

    /*=========================================
    PAGO AUTORIZADO
    =========================================*/

    if (
        empty($response->errorCode) &&
        !empty($response->data) &&
        $codResponse === "0000"
    ) {

        /*
         * Redsys ya ha autorizado el pago.
         *
         * Volvemos a la página dinámica del CMS.
         */
        header(
            "Location: http://localhost:4321/order/pricecafe"
        );

        exit;
    }

    /*=========================================
    PAGO NO AUTORIZADO
    =========================================*/
}


/*=============================================
VOLVER A LA PÁGINA DEL PEDIDO
=============================================*/

header(
    "Location: http://localhost:4321/order/pricecafe"
);

exit;