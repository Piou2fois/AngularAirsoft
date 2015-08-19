<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
//$request->newdb='tata';
$filename = $request->newdb.'.db';
chdir(dirname(__DIR__).'/databases/');
if (file_exists($filename)) {
    echo "La base de données existe déjà";
} else {
  try{
      $pdo = new PDO('sqlite:'.dirname(__DIR__).'/databases/'.$filename);
      $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
      $sql=file_get_contents('database.sql');
      $pdo->exec($sql);
  } catch(Exception $e) {
      echo "Impossible d'accéder à la base de données SQLite : ".$e->getMessage();
      die();
  }
}

?>
