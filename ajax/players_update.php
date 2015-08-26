<?php
    header("Access-Control-Allow-Origin: *");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once('pdo_connect.php');
    $stmt = $pdo->prepare('
      UPDATE
        T_PLAYERS
      SET
        PLAYERS_LASTNAME=:PLAYERS_LASTNAME
        ,PLAYERS_FIRSTNAME=:PLAYERS_FIRSTNAME
        ,PLAYERS_NICKNAME=:PLAYERS_NICKNAME
        ,PLAYERS_TEAM=:PLAYERS_TEAM
        ,PLAYERS_BIRTHDATE=:PLAYERS_BIRTHDATE
        ,PLAYERS_ADDRESS=:PLAYERS_ADDRESS
        ,PLAYERS_PHONE=:PLAYERS_PHONE
      WHERE
        PLAYERS_ID=:PLAYERS_ID');
	$stmt->bindValue(':PLAYERS_ID',$request->PLAYERS_ID,PDO::PARAM_INT);
  $stmt->bindValue(':PLAYERS_LASTNAME',$request->PLAYERS_LASTNAME,PDO::PARAM_STR);
  $stmt->bindValue(':PLAYERS_FIRSTNAME',$request->PLAYERS_FIRSTNAME,PDO::PARAM_STR);
  $stmt->bindValue(':PLAYERS_NICKNAME',$request->PLAYERS_NICKNAME,PDO::PARAM_STR);
  $stmt->bindValue(':PLAYERS_TEAM',$request->PLAYERS_TEAM,PDO::PARAM_STR);
  $stmt->bindValue(':PLAYERS_BIRTHDATE',$request->PLAYERS_BIRTHDATE,PDO::PARAM_STR);
  $stmt->bindValue(':PLAYERS_ADDRESS',$request->PLAYERS_ADDRESS,PDO::PARAM_STR);
  $stmt->bindValue(':PLAYERS_PHONE',$request->PLAYERS_PHONE,PDO::PARAM_STR);
	$stmt->execute();
  print_r($request);
?>
