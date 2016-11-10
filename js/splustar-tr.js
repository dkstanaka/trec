var myYTPLib = (function(){
	var conf = {
		client_id: "mcP9iRE8z04eOrM4f",
		secret: "zivLiXyHprUq7ztqh",
		auth_endpoint: "https://mananda.jp/oauth/",
		redirect_uri: "http://my.splustar.com/~syn/taskapp/timerecorder/",
		scope: "statements/read/mine,statements/write",
		state: "thisistest",
		token_endpoint: "https://mananda.jp/oauth/token.ashx",
		stmt_endpoint: "https://api.mananda.jp/lrs_1/xAPI/statements",
		actIdPrefix: "http://my.splustar.com/^syn/xapi/activity/timerecorder/",
		offline: false
	}
	
	function getConf() {
		return conf;
	}
	
	return {
		getConf: getConf
	}
	
})();

