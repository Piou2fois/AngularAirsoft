<?php
    header("Access-Control-Allow-Origin: *");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once('pdo_connect.php');
    $stmt = $pdo->prepare('
      UPDATE
        T_REPLICAS
      SET
        REPLICAS_NAME=:REPLICAS_NAME
        ,REPLICAS_FPS=:REPLICAS_FPS
        ,REPLICATYPE_ID=:REPLICATYPE_ID
      WHERE
        REPLICAS_ID=:REPLICAS_ID');
	$stmt->bindValue(':REPLICAS_ID',$request->REPLICAS_ID,PDO::PARAM_INT);
  $stmt->bindValue(':REPLICAS_NAME',$request->REPLICAS_NAME,PDO::PARAM_STR);
  $stmt->bindValue(':REPLICAS_FPS',$request->REPLICAS_FPS,PDO::PARAM_STR);
  $stmt->bindValue(':REPLICATYPE_ID',$request->REPLICATYPE_ID,PDO::PARAM_STR);//PARAM_STR instead of PARAM_INT because the REPLICATYPE_ID system is not ready
	$stmt->execute();
?>
