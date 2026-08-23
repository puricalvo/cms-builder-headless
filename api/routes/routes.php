<?php

require_once "models/connection.php";
require_once "controllers/get.controller.php";

$routesArray = array_values(
    array_filter(
        explode(
            "/",
            parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
        )
    )
);

if (($routesArray[0] ?? "") === "api") {
    array_shift($routesArray);
}

/*=============================================
Variables de rutas especiales
=============================================*/

$route = $routesArray[0] ?? "";

$isMediaEndpoint = ($route === "media");

$isExternalEndpoint = ($route === "externas");

$isRedsysChallengeEndpoint = (
    $route === "redsys" &&
    ($routesArray[1] ?? "") === "challenge-response"
);

$isRedsysCardEndpoint = (
    $route === "redsys" &&
    ($routesArray[1] ?? "") === "card" &&
    ($routesArray[2] ?? "") === "rest"
);

$isRedsysEndpoint = ($route === "redsys");


/*=============================================
Cuando no se hace ninguna petición a la API
=============================================*/

if (count($routesArray) == 0) {

    $json = array(
        'status' => 404,
        'results' => 'Not Found'
    );

    echo json_encode(
        $json,
        http_response_code($json["status"])
    );

    return;
}


/*=============================================
Cuando si se hace una petición a la API
=============================================*/

if (
    count($routesArray) >= 1 &&
    isset($_SERVER['REQUEST_METHOD'])
) {

    $table = explode("?", $routesArray[0])[0];


    /*=============================================
    Endpoint independiente para Multimedia
    =============================================*/

    if ($isMediaEndpoint) {

        require_once "services/media.php";

        return;
    }


    /*=============================================
    Endpoint independiente para datos externos
    =============================================*/

    if ($isExternalEndpoint) {

        require_once "services/externas.php";

        return;
    }


    /*=============================================
    Endpoint independiente para Redsys Challenge
    =============================================*/

    if ($isRedsysChallengeEndpoint) {

        require_once "services/redsys_challenge.php";

        return;
    }


    /*=============================================
    Endpoint independiente para Redsys card REST
    =============================================*/

    if ($isRedsysCardEndpoint) {

        require_once "services/redsys_card.php";

        return;
    }


    /*=============================================
    Endpoint independiente para Redsys
    =============================================*/

    if ($isRedsysEndpoint) {

        require_once "services/redsys.php";

        return;
    }


    /*=============================================
    Validar llave secreta
    =============================================*/

    if (
        !isset(getallheaders()["Authorization"]) ||
        getallheaders()["Authorization"] != Connection::apikey()
    ) {

        if (
            in_array(
                $table,
                Connection::publicAccess()
            ) == 0
        ) {

            $json = array(
                'status' => 400,
                "results" => "You are not authorized to make this request"
            );

            echo json_encode(
                $json,
                http_response_code($json["status"])
            );

            return;

        } else {

            /*=============================================
            Acceso público
            =============================================*/

            $response = new GetController();

            $response->getData(
                $table,
                "*",
                null,
                null,
                null,
                null
            );

            return;
        }
    }


    /*=============================================
    Peticiones GET
    =============================================*/

    if ($_SERVER['REQUEST_METHOD'] == "GET") {

        include "services/get.php";
    }


    /*=============================================
    Peticiones POST
    =============================================*/

    if ($_SERVER['REQUEST_METHOD'] == "POST") {

        include "services/post.php";
    }


    /*=============================================
    Peticiones PUT
    =============================================*/

    if ($_SERVER['REQUEST_METHOD'] == "PUT") {

        include "services/put.php";
    }


    /*=============================================
    Peticiones DELETE
    =============================================*/

    if ($_SERVER['REQUEST_METHOD'] == "DELETE") {

        include "services/delete.php";
    }
}