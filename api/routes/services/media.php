<?php

require_once "models/connection.php";
require_once "models/post.model.php";

/*=============================================
Solo permitimos POST
=============================================*/

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "status" => 405,
        "results" => "Method Not Allowed"
    ]);

    return;

}

/*=============================================
Comprobar que llega un archivo
=============================================*/

if (!isset($_FILES["file"])) {

    echo json_encode([
        "status" => 400,
        "results" => "No se recibió ningún archivo"
    ]);

    return;

}

/*=============================================
Comprobar autorización
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
Capturar archivo
=============================================*/

$file = $_FILES["file"];

/*=============================================
Generar nombre único
=============================================*/

$extension = pathinfo($file["name"], PATHINFO_EXTENSION);

$fileName = uniqid() . time() . "." . $extension;

/*=============================================
Ruta física
=============================================*/

$uploadDir = dirname(__DIR__, 3) . "/dashboard/views/assets/files/";

if (!is_dir($uploadDir)) {

    mkdir($uploadDir, 0777, true);

}

$destination = $uploadDir . $fileName;

/*=============================================
Guardar archivo
=============================================*/

if (!move_uploaded_file($file["tmp_name"], $destination)) {

    echo json_encode([
        "status" => 500,
        "results" => "No se pudo guardar el archivo"
    ]);

    return;

}

/*=============================================
Generar URL pública
=============================================*/

$link = "http://cms-builder-headless-dash.com/views/assets/files/" . $fileName;


/*=============================================
Guardar información en la tabla files
=============================================*/

$data = [

    "id_folder_file" => 1,
    "name_file" => pathinfo($file["name"], PATHINFO_FILENAME),
    "extension_file" => $extension,
    "type_file" => $file["type"],
    "size_file" => $file["size"],
    "link_file" => $link,
    "date_created_file" => date("Y-m-d")

];

$result = PostModel::postData("files", $data);

if (!isset($result["lastId"])) {

    unlink($destination);

    echo json_encode([
        "status" => 500,
        "results" => "No se pudo registrar el archivo en la base de datos"
    ]);

    return;

}

/*=============================================
Respuesta
=============================================*/

echo json_encode([
    "status" => 200,
    "results" => "Archivo subido correctamente",
    "id_file" => $result["lastId"],
    "file" => $fileName,
    "link" => $link
]);