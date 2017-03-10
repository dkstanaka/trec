<?php
	
	$url = "https://maps.googleapis.com/maps/api/geocode/json";
	$apiKey = "[google api key]";
	
	$queryStr = $_SERVER['QUERY_STRING'];
	$apiCall = $url."?".$queryStr."&key=" . $apiKey;
	$respJson = file_get_contents($apiCall);
	
	header('Content-Type: application/json');
	echo $respJson;
?>
