<?php

require_once "models/connection.php";
require_once "controllers/post.controller.php";
require_once "models/get.model.php";

/*=============================================
Métodos permitidos
=============================================*/

$method = $_SERVER["REQUEST_METHOD"];

if (!in_array($method, ["POST", "PUT", "DELETE"])) {

    echo json_encode([
        "status" => 405,
        "results" => "Method Not Allowed"
    ]);

    return;

}

/*=============================================
Validar API KEY
=============================================*/

$headers = getallheaders();

if (
    !isset($headers["Authorization"]) ||
    $headers["Authorization"] !== Connection::apikey()
) {

    echo json_encode([
        "status" => 401,
        "results" => "Unauthorized"
    ]);

    return;

}

/*=============================================
Obtener tabla
=============================================*/

$table = $_GET["table"] ?? null;

if (empty($table)) {

    echo json_encode([
        "status" => 400,
        "results" => "Table required"
    ]);

    return;

}

/*=============================================
Obtener suffix del módulo
=============================================*/

$suffix_module = $_GET["suffix_module"] ?? null;

if (empty($suffix_module)) {

    echo json_encode([
        "status" => 400,
        "results" => "suffix_module required"
    ]);

    return;

}

/*=============================================
REGISTRO DE CLIENTE
=============================================*/

if (
    $method === "POST" &&
    isset($_GET["register"]) &&
    $_GET["register"] == "true"
) {

    /*=============================================
    Comprobar que llegan datos POST
    =============================================*/

    if (empty($_POST)) {

        echo json_encode([
            "status" => 400,
            "results" => "No data received"
        ]);

        return;

    }

    /*=============================================
    Añadir fecha de creación
    =============================================*/

    $dateCreatedField = "date_created_" . $suffix_module;

    $_POST[$dateCreatedField] = date("Y-m-d");

    /*=============================================
    Validar columnas
    =============================================*/

    $columns = array_keys($_POST);

    if (empty(Connection::getColumnsData($table, $columns))) {

        echo json_encode([
            "status" => 400,
            "results" => "Error: Fields in the form do not match the database"
        ]);

        return;

    }

    /*=============================================
    Registrar cliente y generar token
    =============================================*/

    $suffix = $_GET["suffix"] ?? "user";

    $response = new PostController();

    $response->postRegister(
        $table,
        $_POST,
        $suffix
    );

    return;

}

/*=============================================
Obtener token
=============================================*/

$token = $_GET["token"] ?? null;

if (empty($token)) {

    echo json_encode([
        "status" => 401,
        "results" => "Token required"
    ]);

    return;

}

/*=============================================
Datos para validar token
=============================================*/

$tableToken = $_GET["tableToken"] ?? "customers";
$suffix = $_GET["suffix"] ?? "customer";

/*=============================================
Validar token
=============================================*/

$validate = Connection::tokenValidate(
    $token,
    $tableToken,
    $suffix
);


/*=============================================
Token válido
=============================================*/

if ($validate == "ok") {

    /*=============================================
    POST
    =============================================*/

    if ($method === "POST") {

        if (empty($_POST)) {

            echo json_encode([
                "status" => 400,
                "results" => "No data received"
            ]);

            return;

        }

        /*=============================================
        Obtener administrador autenticado
        =============================================*/

        $admin = GetModel::getDataFilter(
            $tableToken,
            "*",
            "token_".$suffix,
            $token,
            null,
            null,
            null,
            null
        );

        if (empty($admin)) {

            echo json_encode([
                "status" => 401,
                "results" => "Administrator not found"
            ]);

            return;

        }

        $_POST["id_admin_test_order"] = $admin[0]->id_admin;
        $_POST["email_admin_test_order"] = $admin[0]->email_admin;

        /*=============================================
        Añadir fecha de creación
        =============================================*/

        $dateCreatedField = "date_created_" . $suffix_module;

        $_POST[$dateCreatedField] = date("Y-m-d");
        $_POST["date_test_order"] = date("Y-m-d H:i:s");

        /*=============================================
        Validar columnas
        =============================================*/

        $columns = array_keys($_POST);

        if (empty(Connection::getColumnsData($table, $columns))) {

            echo json_encode([
                "status" => 400,
                "results" => "Error: Fields in the form do not match the database"
            ]);

            return;

        }

        /*=============================================
        Crear registro
        =============================================*/

        $response = new PostController();

        $response->postData(
            $table,
            $_POST
        );

        return;

    }


    /*=============================================
    PUT
    =============================================*/

    if ($method === "PUT") {

        require_once "controllers/put.controller.php";

        parse_str(file_get_contents("php://input"), $_PUT);

        if (empty($_PUT)) {

            echo json_encode([
                "status" => 400,
                "results" => "No data received"
            ]);

            return;

        }

        /*=============================================
        Obtener ID
        =============================================*/

        $id = $_GET["id"] ?? null;
        $nameId = $_GET["nameId"] ?? null;

        if (empty($id) || empty($nameId)) {

            echo json_encode([
                "status" => 400,
                "results" => "ID and nameId required"
            ]);

            return;

        }

        /*=============================================
        Validar columnas
        =============================================*/

        $columns = array_keys($_PUT);

        if (empty(Connection::getColumnsData($table, $columns))) {

            echo json_encode([
                "status" => 400,
                "results" => "Error: Fields in the form do not match the database"
            ]);

            return;

        }

        /*=============================================
        Actualizar registro
        =============================================*/

        $response = new PutController();

        $response->putData(
            $table,
            $_PUT,
            $id,
            $nameId
        );

        return;

    }


    /*=============================================
    DELETE
    =============================================*/

    if ($method === "DELETE") {

        require_once "controllers/delete.controller.php";

        $id = $_GET["id"] ?? null;
        $nameId = $_GET["nameId"] ?? null;

        if (empty($id) || empty($nameId)) {

            echo json_encode([
                "status" => 400,
                "results" => "ID and nameId required"
            ]);

            return;

        }

        /*=============================================
        Eliminar registro
        =============================================*/

        $response = new DeleteController();

        $response->deleteData(
            $table,
            $id,
            $nameId
        );

        return;

    }

}

/*=============================================
Token expirado
=============================================*/

if ($validate == "expired") {

    echo json_encode([
        "status" => 303,
        "results" => "The token has expired"
    ]);

    return;

}

/*=============================================
Token no autorizado
=============================================*/

if ($validate == "no-auth") {

    echo json_encode([
        "status" => 401,
        "results" => "The user is not authorized"
    ]);

    return;

}