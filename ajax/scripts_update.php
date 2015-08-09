<?php
    header("Access-Control-Allow-Origin: *");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once('pdo_connect.php');
    $stmt = $pdo->prepare('
      UPDATE
        T_SCRIPTS
      SET
        SCRIPTS_NAME=:SCRIPTS_NAME
        ,SCRIPTS_DESCRIPTION=:SCRIPTS_DESCRIPTION
        ,SCRIPTS_DETAILS=:SCRIPTS_DETAILS
      WHERE
        SCRIPTS_ID=:SCRIPTS_ID');
	$stmt->bindValue(':SCRIPTS_ID',$request->SCRIPTS_ID,PDO::PARAM_INT);
  $stmt->bindValue(':SCRIPTS_NAME',$request->SCRIPTS_NAME,PDO::PARAM_STR);
  $stmt->bindValue(':SCRIPTS_DESCRIPTION',$request->SCRIPTS_DESCRIPTION,PDO::PARAM_STR);
  $stmt->bindValue(':SCRIPTS_DETAILS',$request->SCRIPTS_DETAILS,PDO::PARAM_STR);
	$stmt->execute();
?>
