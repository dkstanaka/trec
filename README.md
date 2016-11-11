# tRec
Mananda のサンプルとして作った簡単な打刻アプリケーション

#### 使い方
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
6. 楽しんでください
