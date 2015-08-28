<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    if ($request->picture =='' || empty($request->picture) ) {
      $uniq_id='';
    }
    else {
      $uniq_id=uniqid("",false);
    }
    require_once('pdo_connect.php');
    $stmt = $pdo->prepare('INSERT INTO T_REPLICAS(PLAYERS_ID, REPLICAS_NAME, REPLICAS_FPS,REPLICATYPE_ID,REPLICAS_PICTURE) VALUES(:PLAYERS_ID,:REPLICAS_NAME,:REPLICAS_FPS,:REPLICATYPE_ID,:REPLICAS_PICTURE)');
  	$stmt->bindValue(':PLAYERS_ID',$request->PLAYERS_ID,PDO::PARAM_INT);
  	$stmt->bindValue(':REPLICAS_NAME',$request->REPLICAS_NAME,PDO::PARAM_STR);
  	$stmt->bindValue(':REPLICAS_FPS',$request->REPLICAS_FPS,PDO::PARAM_INT);
  	$stmt->bindValue(':REPLICATYPE_ID',$request->REPLICATYPE_ID,PDO::PARAM_INT);
  	$stmt->bindValue(':REPLICAS_PICTURE',$uniq_id,PDO::PARAM_STR);
    $stmt->execute();

    $stmt = $pdo->prepare("SELECT REPLICAS_ID,PLAYERS_ID, REPLICAS_NAME, REPLICAS_FPS,REPLICATYPE_ID,REPLICAS_PICTURE FROM T_REPLICAS WHERE REPLICAS_ID IN(SELECT SEQ FROM SQLITE_SEQUENCE WHERE NAME='T_REPLICAS')");
    $stmt->execute();
    $dbh = array();
    foreach ($stmt as $row) {
    $dbh[]=$row;
    }
    echo json_encode($dbh, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);//return the json of the last inserted replica
    if ($uniq_id !== '') {
    	require('function_base64_to_file.php');
    	$file_name=dirname(__DIR__)."/pictures/replicas/".$uniq_id.".jpg";
    	base64_to_jpeg($request->picture,$file_name);
    }
?>
