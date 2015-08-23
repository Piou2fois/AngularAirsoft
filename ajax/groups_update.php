<?php
    header("Access-Control-Allow-Origin: *");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once('pdo_connect.php');
    $stmt = $pdo->prepare('
      UPDATE
        T_GROUPS
      SET
        GROUPS_NAME=:GROUPS_NAME
        ,GROUPS_DESCRIPTION=:GROUPS_DESCRIPTION
      WHERE
        GROUPS_ID=:GROUPS_ID');
	$stmt->bindValue(':GROUPS_ID',$request->GROUPS_ID,PDO::PARAM_INT);
  $stmt->bindValue(':GROUPS_NAME',$request->GROUPS_NAME,PDO::PARAM_STR);
  $stmt->bindValue(':GROUPS_DESCRIPTION',$request->GROUPS_DESCRIPTION,PDO::PARAM_STR);
	$stmt->execute();
?>
