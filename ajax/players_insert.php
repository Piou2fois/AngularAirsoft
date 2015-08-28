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
    $stmt = $pdo->prepare('
                          INSERT INTO
                            T_PLAYERS(PLAYERS_LASTNAME,PLAYERS_FIRSTNAME, PLAYERS_NICKNAME, PLAYERS_TEAM,PLAYERS_PICTURE,PLAYERS_BIRTHDATE,PLAYERS_ADDRESS,PLAYERS_PHONE)
                          VALUES(:PLAYERS_LASTNAME,:PLAYERS_FIRSTNAME,:PLAYERS_NICKNAME,:PLAYERS_TEAM,:PLAYERS_PICTURE,:PLAYERS_BIRTHDATE,:PLAYERS_ADDRESS,:PLAYERS_PHONE)
                            ');
    $stmt->bindValue(':PLAYERS_LASTNAME',$request->PLAYERS_LASTNAME,PDO::PARAM_STR);
    $stmt->bindValue(':PLAYERS_FIRSTNAME',$request->PLAYERS_FIRSTNAME,PDO::PARAM_STR);
    $stmt->bindValue(':PLAYERS_NICKNAME',$request->PLAYERS_NICKNAME,PDO::PARAM_STR);
    $stmt->bindValue(':PLAYERS_TEAM',$request->PLAYERS_TEAM,PDO::PARAM_STR);
    $stmt->bindValue(':PLAYERS_BIRTHDATE',$request->PLAYERS_BIRTHDATE,PDO::PARAM_STR);
    $stmt->bindValue(':PLAYERS_ADDRESS',$request->PLAYERS_ADDRESS,PDO::PARAM_STR);
    $stmt->bindValue(':PLAYERS_PHONE',$request->PLAYERS_PHONE,PDO::PARAM_STR);
    $stmt->bindValue(':PLAYERS_PICTURE',$uniq_id,PDO::PARAM_STR);
    $stmt->execute();
    $stmt = $pdo->prepare("SELECT * FROM T_PLAYERS WHERE PLAYERS_ID IN(SELECT SEQ FROM SQLITE_SEQUENCE WHERE NAME='T_PLAYERS')");
    $stmt->execute();
    $dbh = array();
    foreach ($stmt as $row) {
    $dbh[]=$row;
    }
    echo json_encode($dbh, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);//return the json of the last inserted player
    if ($uniq_id !== '') {
    	require('function_base64_to_file.php');
    	$file_name=dirname(__DIR__)."/pictures/players/".$uniq_id.".jpg";
    	base64_to_jpeg($request->picture,$file_name);
    }
?>
