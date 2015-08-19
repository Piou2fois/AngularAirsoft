<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
chdir(dirname(__DIR__).'/databases/');
$databases=array();
foreach (glob("*.db") as $filename) {
  $databases[]=array('name'=>pathinfo($filename, PATHINFO_FILENAME),'file'=>$filename);
}
    echo json_encode($databases, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);

?>
