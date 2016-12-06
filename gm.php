<?php
	
	$url = "https://maps.googleapis.com/maps/api/geocode/json";
	$apiKey = "AIzaSyASD638tVSbGy33U9gYdCSiac5kB_Lnl3o";
	
	// sample query string
	// latlng=35.703031800000005,139.7744061&language=ja&result_type=locality|political
	
	$queryStr = $_SERVER['QUERY_STRING'];
	$apiCall = $url."?".$queryStr."&key=" . $apiKey;
	$respJson = file_get_contents($apiCall);
	
	header('Content-Type: application/json');
	echo $respJson;
?>
