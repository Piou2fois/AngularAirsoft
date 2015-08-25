<?php
  header("Access-Control-Allow-Origin: *");
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
  require_once('pdo_connect.php');
  $stmt = $pdo->prepare("DELETE FROM T_PLAYERS WHERE PLAYERS_ID = $request->PLAYERS_ID");
  $stmt->execute();
  unlink(dirname(__DIR__)."/pictures/players/".$request->PLAYERS_PICTURE.".jpg");
?>
