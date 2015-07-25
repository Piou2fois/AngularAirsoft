<?php
$toto = '
  UPDATE
    T_PLAYERS
  SET
    PLAYERS_LASTNAME=:lastname
    ,PLAYERS_FIRSTNAME=:firstname
    ,PLAYERS_NICKNAME=:nickname
    ,PLAYERS_TEAM=:team
    ,PLAYERS_PICTURE=:picture
  WHERE
    PLAYERS_ID=:id';
echo $toto;

 ?>
