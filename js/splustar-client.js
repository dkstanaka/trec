/*
 * Mananda OAuth Client Library
 * Splustar.com
 */
function Client(cfg) {
	
	var ivStr = new Date().toISOString();
	
	this.auth_endpoint = cfg.auth_endpoint;
	this.client_id = cfg.client_id;
	this.client_secret = cfg.secret;
	this.redirect_uri = cfg.redirect_uri;
	this.scope = cfg.scope;
	this.state = sha256(ivStr);
	this.access_token_key = null;
	this.refresh_token_key = null;
};

Client.prototype.setSession = function(k, v) {
	var sess = $.sessionStorage;
	sess.set(k, v);
}

Client.prototype.getSession = function(k) {
	var sess = $.sessionStorage;
	return sess.get(k);
}

Client.prototype.setAccessTokenKey = function(k) {
	this.access_token_key = k;
}

Client.prototype.setRefreshTokenKey = function(k) {
	this.refresh_token_key = k;
}

Client.prototype.getAccessTokenKey = function(k) {
	return this.access_token_key;
}

Client.prototype.getRefreshTokenKey = function(k) {
	return this.refresh_token_key;
}

Client.prototype.setAccessToken = function (t) {
	this.access_token = t;
}

Client.prototype.setRefreshToken = function (t) {
	this.refresh_token = t;
}

Client.prototype.setCode = function (str) {
	this.code = str;
}

Client.prototype.makeAuthRequest = function () {
	buf = "client_id=" + this.client_id +
				"&redirect_uri=" + this.redirect_uri +
				"&response_type=code" +
				"&scope=" + this.scope +
				"&state=" + this.state;
	return this.auth_endpoint + "?" + buf;
};

Client.prototype.startOAuth = function () {
	location.href = this.makeAuthRequest();
};

Client.prototype.checkCode = function() {
	var buf = [], hash;
	var url = decodeURI(window.location.href);
	var hashes = url.slice(url.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++)
	{
			hash = hashes[i].split('=');
			buf.push(hash[0]);
			buf[hash[0]] = hash[1];
	}
	return buf;
}

Client.prototype.requestToken = function(callback) {
	var d = {
		client_id: this.client_id,
		client_secret: this.client_secret,
		grant_type: "authorization_code",
		code: this.code,
		redirect_uri: this.redirect_uri,
		state: this.state
	};
	
	var request = $.ajax({
		url: conf.token_endpoint,
		type: "post",
		dataType: "json",
		data: d
	});
	
	var ak = this.access_token_key,
			rk = this.refresh_token_key;
			
	request.done(function(json, status, jqXHR){
		this.access_token = json.access_token;
		this.refresh_token = json.refresh_token;
		
		Client.prototype.setSession(ak, json.access_token);
		Client.prototype.setSession(rk, json.refresh_token);
		
		if (typeof callback === 'function')
			callback();
	});
	
	request.fail(function(jqXHR, status, e){
		this.responseHandler(jqXHR, status);
	});
}

// ※refresh は localStorage を使うのが理想
Client.prototype.refreshAccessToken = function() {
	var d = {
		client_id: this.client_id,
		client_secret: this.client_secret,
		grant_type: "refresh_token",
		refresh_token: this.getSession(this.refresh_token_key)
	};
	
	var request = $.ajax({
		url: conf.token_endpoint,
		type: "post",
		dataType: "json",
		data: d
	});
	
	var ak = this.access_token_key;
	
	request.done(function(json, status, jqXHR){
		this.access_token = json.access_token;
		Client.prototype.setSession(ak, json.access_token);
	});
	
	request.fail(function(jqXHR, status, e){
		console.log("error: " + status);
		this.startOAuth(); // リフレッシュに失敗したら認可要求
	});
}

Client.prototype.getStatements = function (actId, opt, callback) {
	if (!this.getSession(this.access_token_key)) {
		console.log("empty access token!" + this.access_token_key);
		this.startOAuth(); // アクセストークンがなければ認可要求
		// 認可要求前に getStatements 中であることを localStorage に記録予定
	}
	
	// ※demoUrl: profile api は未実装
	var optStr = "";
	if (opt.limit !== undefined) {
		//optStr = "&limit=" + opt.limit;
	}
	var demoUrl = "https://api.mananda.jp/lrs_1/xAPI/profile",
			prodUrl = conf.stmt_endpoint + "?activity=" + actId + optStr;
	
	$.ajaxSetup({
		headers: {
			"X-Experience-API-Version": "1.0.1"
		}
	});
	
	var ak = this.access_token_key;
	var request = $.ajax({
		type: "get",
		url: prodUrl,
		contentType: "application/json",
		beforeSend: function(xhr) {
			var bearer = Client.prototype.getSession(ak);
			xhr.setRequestHeader("Authorization", "Bearer " + bearer);
		}
	});
	
	request.done(function(d, textStatus, jqXHR){
		console.log("status: " + textStatus);
		if (typeof callback === 'function')
			callback(d);
	});
	
	request.fail(function(jqXHR, textStatus, e){
		acquiredStmt = null;
		Client.prototype.responseHandler(jqXHR, textStatus);
	});
}

Client.prototype.sendStatement = function (stmtObj, callback) {
	
	$.ajaxSetup({
		headers: {
			"X-Experience-API-Version": "1.0.1"
		}
	});
	
	var ak = this.access_token_key;
	var request = $.ajax({
		type: "put",
		url: conf.stmt_endpoint + "?statementId=" + stmtObj.id,
		contentType: "application/json",
		cache: false,
		data: JSON.stringify(stmtObj),
		beforeSend: function(xhr) {
			var bearer = Client.prototype.getSession(ak);
			xhr.setRequestHeader("Authorization", "Bearer " + bearer);
		}
	});
	
	request.done(function(d, textStatus, jqXHR){
		if (typeof callback === 'function')
			callback();
	});
	
	request.fail(function(jqXHR, textStatus, e){
		Client.prototype.responseHandler(jqXHR, textStatus);
	});
}

Client.prototype.responseHandler = function(xhr, status) {
	console.log("error: " + status);
	var rt = $.parseJSON(xhr.responseText);
	console.log(rt);
}

Client.prototype.getUnixTimestamp = function(dtStr) {
	var dt = new Date(dtStr);
	return Math.floor(dt.getTime()/1000);
}

Client.prototype.getDatetime = function(dtStr) {
	var dt = new Date(dtStr);
	var y = dt.getFullYear(),
			m = dt.getMonth() + 1,
			d = dt.getDate(),
			h = dt.getHours(),
			mi = dt.getMinutes();
			
			function zp(s) {
				r = s;
				if (r < 10)
					r = "0" + r;
				return r;
			}
			
	return y + "/" + zp(m) + "/" + zp(d) + " " + zp(h) + ":" + zp(mi);
}

