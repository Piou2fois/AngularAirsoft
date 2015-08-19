<?php
  header("Access-Control-Allow-Origin: *");
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
  require_once('pdo_connect.php');
  $stmt = $pdo->prepare("DELETE FROM T_SCRIPTS WHERE SCRIPTS_ID = $request->id");
  $stmt->execute();
?>
