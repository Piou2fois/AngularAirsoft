<?php
    header("Access-Control-Allow-Origin: *");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
	$uniq_id=uniqid("",false);
    require_once('pdo_connect.php');
    $stmt = $pdo->prepare('UPDATE T_PLAYERS SET PLAYERS_PICTURE=:picture WHERE PLAYERS_ID=:id');
	$stmt->bindValue(':id',$request->id,PDO::PARAM_INT);
	$stmt->bindValue(':picture',$uniq_id,PDO::PARAM_STR);
	$stmt->execute();

	require('function_base64_to_file.php');
	$file_name=dirname(__DIR__)."/pictures/players/".$uniq_id.".jpg";
	base64_to_jpeg($request->base64,$file_name);
	unlink(dirname(__DIR__)."/pictures/players/".$request->picture.".jpg");
	echo $uniq_id;
?>