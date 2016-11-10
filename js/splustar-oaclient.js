var oaClient = (function(){
	
	var ss = $.sessionStorage;
	
	function Client(cfg) {
		
		this.auth_endpoint = cfg.auth_endpoint;
		this.client_id = cfg.client_id;
		this.client_secret = cfg.secret;
		this.redirect_uri = cfg.redirect_uri;
		this.scope = cfg.scope;
		this.state = cfg.state;
		
	};
	
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
		window.location.href = this.makeAuthRequest();
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
	
	Client.prototype.requestToken = function() {
		var d = {
			client_id: this.client_id,
			client_secret: this.client_secret,
			grant_type: "authorization_code",
			code: this.code,
			redirect_uri: this.redirect_uri,
			state: this.state
		};
		
		$.ajax({
			url: conf.token_endpoint,
			type: "post",
			dataType: "json",
			data: d,
			success:
				function (json, status) {
					this.access_token = json.access_token;
					this.refresh_token = json.refresh_token;
					
					ss.set("access", json.access_token);
					ss.set("refresh", json.refresh_token); // ※本当は localstorage に入れるべき
				},
			error:
				function (data) {
					console.log("error!");
				}
		});
	}
	Client.prototype.sendStatement = function (stmtObj) {
		
		$.ajaxSetup({
			headers: {
				"X-Experience-API-Version": "1.0.1"
			}
		});
		
		$.ajax({
			type: "put",
			url: conf.stmt_endpoint + "?statementId=" + stmtObj.id,
			contentType: "application/json",
			cache: false,
			data: JSON.stringify(stmtObj),
			beforeSend: function(xhr) {
				var bearer = ss.get("access");
				xhr.setRequestHeader("Authorization", "Bearer " + bearer);
			},
			success:
				function(d) {
					console.log("success!");
				},
			error:
				function(x,s,e) {
					console.log("error: " + s);
				},
			complete:
				function() {
					console.log("completed!");
				}
		});
	}
	
	return {
		Client: Client
	};
})();
