<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once('pdo_connect.php');
    $stmt = $pdo->prepare('
      INSERT INTO
        T_SCRIPTS(
          SCRIPTS_NAME
          ,SCRIPTS_DESCRIPTION
          ,SCRIPTS_DETAILS
        )
      VALUES(
        :SCRIPTS_NAME
        ,:SCRIPTS_DESCRIPTION
        ,:SCRIPTS_DETAILS
      )
    ');
    $stmt->bindValue(':SCRIPTS_NAME',$request->SCRIPTS_NAME,PDO::PARAM_STR);
    $stmt->bindValue(':SCRIPTS_DESCRIPTION',$request->SCRIPTS_DESCRIPTION,PDO::PARAM_STR);
    $stmt->bindValue(':SCRIPTS_DETAILS',$request->SCRIPTS_DETAILS,PDO::PARAM_STR);
    $stmt->execute();
    $stmt = $pdo->prepare("
    SELECT
      *
    FROM
      T_SCRIPTS
    WHERE
      SCRIPTS_ID
    IN(
      SELECT
        SEQ
      FROM
        SQLITE_SEQUENCE
      WHERE
        NAME='T_SCRIPTS'
      )
    ");
    $stmt->execute();
    $dbh = array();
    foreach ($stmt as $row) {
    $dbh[]=$row;
    }
    echo json_encode($dbh, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);//return the json of the last inserted script
?>
