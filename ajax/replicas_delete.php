<?php
    header("Access-Control-Allow-Origin: *");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once('pdo_connect.php');
    $stmt = $pdo->prepare("DELETE FROM T_REPLICAS WHERE REPLICAS_ID = $request->REPLICAS_ID");
    $stmt->execute();
	  unlink(dirname(__DIR__)."/pictures/replicas/".$request->REPLICAS_PICTURE.".jpg");
?>
