/*
 * AppSpec(Application Specific Class) Library
 * Splustar.com
 */
function AppSpec() {
	this.tcsArray = new Array();
	this.logs = new Array();
	this.allLogs = new Array();
	this.location = {};
	this.locationName = null;
};

AppSpec.prototype.setLocationName = function(ln) {
	this.locationName = ln;
}

AppSpec.prototype.getLocationName = function() {
	return this.locationName;
}

AppSpec.prototype.reverseGeocoding = function (locObj, callback) {
	var url = "gm",
			lat = locObj.latitude,
			lon = locObj.longitude;
	
	var apiCall = url + "?latlng=" + lat + "," + lon + "&language=ja&result_type=locality";
	
	var request = $.ajax({
		type: "get",
		cache: false,
		url: apiCall,
		contentType: "application/json",
	});
	
	request.done(function(d, textStatus, jqXHR){
		console.log("status: " + textStatus);
		
		var fa;
		
		if (typeof d.result !== undefined && d.results instanceof Array) {
			fa = d.results[0].formatted_address;
			AppSpec.prototype.setLocationName(fa);
		}
		else {
			fa = null;
		}
		
		if (typeof callback === 'function')
			callback(fa);
	});
	
	request.fail(function(jqXHR, textStatus, e){
		acquiredStmt = null;
		AppSpec.prototype.responseHandler(jqXHR, textStatus);
	});
}

AppSpec.prototype.responseHandler = function(xhr, status) {
	console.log("error: " + status);
	if (typeof xhr.responseText === "object") {
		var rt = $.parseJSON(xhr.responseText);
		console.log(xhr);
	}
	// codeに応じた処理を呼び出す予定
}

AppSpec.prototype.setLocation = function (locObj, callback) {
	if (locObj.status == "success") {
		this.location = {
			latitude: locObj.latitude,
			longitude: locObj.longitude,
			accuracy: locObj.accuracy
		}
	}
	else if (locObj.status == "fail") {
		this.location = {
			status: locObj.status,
			message: locObj.message
		}
	}
	
	if (typeof callback === "function")
		callback(this.location);
}

AppSpec.prototype.getLocation = function () {
	return this.location;
}

AppSpec.prototype.pushTcsArray = function (d, callback) {
	var acquiredStmt = JSON.parse(JSON.stringify(d));
	var ta = new Array();
	if (acquiredStmt.statements !== undefined) {
		var stmtLen = acquiredStmt.statements.length;
		if (stmtLen > 0) {
			acquiredStmt.statements.reverse().forEach(function(stmtObj){
				ta.push(stmtObj);
			});
			for (var i = 0; i < ta.length; i++)
				this.tcsArray.push(ta[i]);
				
		}
	}
	if (typeof callback === 'function')
		callback();
}

AppSpec.prototype.makeParamsForLogs = function(s) {
	if (s.context.extensions !== undefined) {
		var params = {
			timestamp: s.timestamp,
			address: s.context.extensions['http://my.splustar.com/xapi/ext/address'],
			practice: s.context.extensions['http://my.splustar.com/xapi/ext/practice'],
			objectName: s.object.definition.name['ja-JP'],
			objectNameEn: s.object.definition.name['en-US'],
			verbDisp: s.verb.display['ja-JP'],
			verbDispEn: s.verb.display['en-US'],
			unixtime: client.getUnixTimestamp(s.timestamp)
		};
	} else {
		var params = {
			timestamp: s.timestamp,
			practice: "を",
			objectName: s.object.definition.name['ja-JP'],
			objectNameEn: s.object.definition.name['en-US'],
			verbDisp: s.verb.display['ja-JP'],
			verbDispEn: s.verb.display['en-US'],
			unixtime: client.getUnixTimestamp(s.timestamp)
		};
	}
	
	return params;
}

AppSpec.prototype.intToTime = function(v) {
	var s = v % 60,
			mv = (v - s)/60,
			m = mv % 60,
			h = (mv - m)/60;
	return this.zeroPadding(h) + ":" +
					this.zeroPadding(m) + "'" +
					this.zeroPadding(s);
}

AppSpec.prototype.appendLog = function(p) {
	
	var pc = p;
	var verbStr = p.verbDisp.replace("した", "");
	var eventStr = client.getDatetime(p.timestamp) + " " + p.objectName + p.practice + verbStr;
	//console.log(eventStr);
	return eventStr;
	
}

AppSpec.prototype.getActivityText = function(p) {
	
	var pc = p;
	var verbStr = p.verbDisp.replace("した", "");
	var eventStr = client.getDatetime(p.timestamp) + " " + p.objectName + p.practice + verbStr;
	return eventStr;
	
}

AppSpec.prototype.sortJsonBy = function(field, reverse, primer) {

  reverse = (reverse) ? -1 : 1;
  return function(a,b){
      a = a[field];
      b = b[field];
      if (typeof(primer) != 'undefined'){
          a = primer(a);
          b = primer(b);
      }
      if (a<b) return reverse * -1;
      if (a>b) return reverse * 1;
      return 0;
  }
}

AppSpec.prototype.zeroPadding = function (s) {
	r = s;
	if (r < 10)
		r = "0" + r;
	return r;
}

AppSpec.prototype.rgb2hex = function(rgb){
	var rgbStr = rgb.toString();
	rgbStr = rgbStr.replace("rgb(", "");
	rgbStr = rgbStr.replace(")", "");
	rgbArr = rgbStr.split(",");
	return "#" +
  ("0" + parseInt(rgbArr[0],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgbArr[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgbArr[2],10).toString(16)).slice(-2);
}
