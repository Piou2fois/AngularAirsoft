<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $params = join( ',', $request );
    require_once('pdo_connect.php');
    // $stmt = $pdo->prepare(' UPDATE T_PLAYERS_GROUPS_PG
    //                         SET GROUPS_ID=:groupId
    //                         WHERE PLAYERS_ID IN (:playerslist)
    //                         ');
    // $stmt->bindValue(':groupId',$_GET['groupId'],PDO::PARAM_INT);
    // $stmt->bindValue(':playerslist',$params,PDO::PARAM_STR);
    // bindValue does not with comma separated values
    $stmt=$pdo->query('UPDATE T_PLAYERS_GROUPS_PG
                             SET GROUPS_ID='.$_GET['groupId'].'
                             WHERE PLAYERS_ID IN ('.$params.')');
?>
