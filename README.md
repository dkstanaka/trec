# tRec-owm
Mananda のサンプルとして作った簡単な打刻アプリケーション。打刻したb所の位置情報を基にGoogle MapsとOpenWeatherMapから、それぞれ地名と気象情報を取得し、LRSに記録する。

#### 事前準備
本アプリケーションは Google Maps Geocoding API, および OpenWeatherMap API を利用するので、事前に両サービスのAPIを取得しておく  

Google APIs  
<https://console.developers.google.com>

OpenWeatherMap  
<http://openweathermap.org/>

また、jQueryをはじめ以下のパッケージを使用するので適宜入手  
 * jquery-1.11.1.min.js   
 * jquery.easing.1.3.js      
 * jquery.shadow.js          
 * jquery.storageapi.min.js  
 * sha256.min.js             
 * tincan-min.js
 * tincan-min.map

#### セットアップ
1. Mananda DeveloperサイトのMananda OAuth API Betaページを参考にアプリケーション登録を行う  
<https://mananda.jp/developer/index2.html>
2. 登録の際発行されたクライアントID, シークレット及び各エンドポイント情報を控えておく  
※画面上では「キー」と表記されている
3. git clone https://github.com/dkstanaka/trec.git
4. cd trac
5. js/splustar-conf.js の編集  
 * client_id: クライアントID
 * secret: シークレット
 * redirect_uri: アプリケーション登録時に設定したリダイレクトURL
 アプリケーションのURL  
 例 "http://example.jp/trec/"
 * scope: アプリケーション登録時に設定したスコープ  
 例 "statements/read/mine,statements/write"  
 * state: ※プログラムが動的に生成
 * actIdPrefix: アクティビティIDのプレフィクス  
 世界中で一意となるようにすること。通常は自身のドメイン名＋パス名  
 例 "http://example.jp/xapi/activity/trec/"  
 * my_scheme: verb, object, context の id プレフィックスに使用する文字列
 世界中で一意となるようにすること。通常は自身のドメイン名＋パス名  
 例 "http://example.jp/xapi/"  
6. gm.php の編集  
 * $apiKey: Google API Key
7. owm.php の編集  
 * $apiKey: OpenWeatherMap API Key
8. .htaccess の作成  
 * 以下の内容をコピペ  
```.htaccess
Options FollowSymLinks
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}\.php -f
RewriteRule ^(.*)$ $1.php
RewriteBase /taskapp/trec-owm/
# Authorization Header
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
```

#### デモ
https://splustar.com/taskapp/trec-owm

---
#### 注記
Safari では動きません
