/*
 * AppSpec(Application Specific Class) Library
 * Splustar.com
 */
function AppSpec() {
	this.tcsArray = new Array();
	this.logs = new Array();
	this.allLogs = new Array();
};

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
	var params = {
		timestamp: s.timestamp,
		practice: s.context.extensions['http://my.splustar.com/xapi/ext/practice'],
		objectName: s.object.definition.name['ja-JP'],
		objectNameEn: s.object.definition.name['en-US'],
		verbDisp: s.verb.display['ja-JP'],
		verbDispEn: s.verb.display['en-US'],
		unixtime: client.getUnixTimestamp(s.timestamp)
	};
	
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
