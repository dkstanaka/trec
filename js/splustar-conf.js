var trecConfLib = (function(){
	var conf = {
		client_id: "your_client_id",
		secret: "your_client_secret",
		auth_endpoint: "https://mananda.jp/oauth/",
		redirect_uri: "redirect_url_of_your_client",
		scope: "scope_of_your_client",
		state: "usualy_changed_dynamicaly",
		token_endpoint: "https://mananda.jp/oauth/token.ashx",
		stmt_endpoint: "https://api.mananda.jp/lrs_1/xAPI/statements",
		actIdPrefix: "activity_id_prefix_for_your_client",
		my_scheme: "xapi_scheme_prefix_for_your_client",
		access_token_key: "key_of_your_access_token",
		refresh_token_key: "key_of_your_refresh_token",
		offline: false
	}
	
	function getConf() {
		return conf;
	}
	
	return {
		getConf: getConf
	}
	
})();

