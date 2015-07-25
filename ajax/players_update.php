<?php
    header("Access-Control-Allow-Origin: *");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once('pdo_connect.php');
    $stmt = $pdo->prepare('
      UPDATE
        T_PLAYERS
      SET
        PLAYERS_LASTNAME=:lastname
        ,PLAYERS_FIRSTNAME=:firstname
        ,PLAYERS_NICKNAME=:nickname
        ,PLAYERS_TEAM=:team
      WHERE
        PLAYERS_ID=:id');
	$stmt->bindValue(':id',$request->PLAYERS_ID,PDO::PARAM_INT);
  $stmt->bindValue(':lastname',$request->PLAYERS_LASTNAME,PDO::PARAM_STR);
  $stmt->bindValue(':firstname',$request->PLAYERS_FIRSTNAME,PDO::PARAM_STR);
  $stmt->bindValue(':nickname',$request->PLAYERS_NICKNAME,PDO::PARAM_STR);
  $stmt->bindValue(':team',$request->PLAYERS_TEAM,PDO::PARAM_STR);
	$stmt->execute();
?>
