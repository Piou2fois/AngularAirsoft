<?php
//Cleaning the orphan pictures
require_once('pdo_connect.php');
//Cleaning the PLAYERS_PICTURE
$stmt = $pdo->prepare("SELECT PLAYERS_PICTURE FROM T_PLAYERS");
$stmt->execute();
$dbh = array();
foreach ($stmt as $row) {
$dbh[]=$row['PLAYERS_PICTURE'].'.jpg';
}
chdir(dirname(__DIR__).'/pictures/players/');
$images = glob('*.{jpg}', GLOB_BRACE);
$result = array_diff($images,$dbh);
foreach ($result as $key => $value) {
  unlink(dirname(__DIR__)."/pictures/players/".$value);
}

$dbh=[];
//Cleaning the REPLICAS_PICTURE
$stmt = $pdo->prepare("SELECT REPLICAS_PICTURE FROM T_REPLICAS");
$stmt->execute();
foreach ($stmt as $row) {
$dbh[]=$row['REPLICAS_PICTURE'].'.jpg';
}
chdir(dirname(__DIR__).'/pictures/replicas/');
$images = glob('*.{jpg}', GLOB_BRACE);
$result = array_diff($images,$dbh);
foreach ($result as $key => $value) {
  echo $value;
  unlink(dirname(__DIR__)."/pictures/replicas/".$value);
}
 ?>
