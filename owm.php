<?php
	
	$url = "http://api.openweathermap.org/data/2.5/weather";
	$apiKey = "[open weather api key]";
	
	$queryStr = $_SERVER['QUERY_STRING'];
	$apiCall = $url."?".$queryStr."&APPID=" . $apiKey;
	$respJson = file_get_contents($apiCall);
	
	header('Content-Type: application/json');
	echo $respJson;
?>
