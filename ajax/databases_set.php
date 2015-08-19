<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if(!empty($request))
{
  if(!empty($request->database))
  {
    session_start();
    $_SESSION['database'] = $request->database;
    echo $_SESSION['database'];
  }
  else {
    echo 'pas top';
  }
}
else {
  echo 'non';
}
 ?>
