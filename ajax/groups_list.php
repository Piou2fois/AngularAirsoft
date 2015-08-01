<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once('pdo_connect.php');
    $stmt = $pdo->prepare("SELECT * FROM T_GROUPS");
    $stmt->execute();
    $dbh = array();
    foreach ($stmt as $row) {
    $dbh[]=$row;
    }
    echo json_encode($dbh, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
?>