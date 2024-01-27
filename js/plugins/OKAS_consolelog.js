/* ==============================================================================
OKAS_consolelog.js
SNS： https://tm-misfit.hateblo.jp
=================================================================================
更新履歴：
2024/01/28 Ver.1.0.1　あらかじめテストプレイ中しか作動しないよう修正。
2024/01/25 Ver.1.0.0　初版
*/
/*:
 * @plugindesc console.logの入力、管理支援
 * @author Okiashi
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://raw.githubusercontent.com/okiashi/RPGMakerMZ/main/OKAS_consolelog.js
 * @help OKAS_consolelog.js (2024/01/25 Ver.1.0.0)
 * 
 * 概要：
 * -console.log('ここに文字');の内容をプラグインコマンドから入力できます。
 * -ログの表示/非表示をスイッチで制御します。
 * -制御文字が使えたり、改行したり、文字スタイル(CSS)が適応できます。
 * -ログ毎に表示形式を選択可能です。(log/warn/error)
 * -変数をテーブル形式で表示するコマンドがあります。
 * ※公式プラグイン「PluginCommonBase.js」が必要です。
 *
 * プラグインコマンド：
 *  1.log    ：制御文字が使えます。下記の簡易文字は使えません。
 *  2.(eval) : 制御文字不可。console.log('ここに文字');と同感覚です。
 *             文字スタイルを使わない場合のみ、簡易文字が使えます。
 *             詳細はプラグイン内部の「制御文字の登録」部分をご確認下さい。
 *             使用例) cyan + '変数1 : ' + $gameVariables.value(1)
 *  3.table  ：パラメータで設定した変数を「テーブル形式」で表示します。
 * 
 * メモ：
 * - プラグイン名を「A」などから始まる名前に変えていただくと、使用時に
 *   プラグインコマンドを選択しやすくなりますのでおすすめです。
 * - 開発支援のプラグインですので、完成時にOFFにするなど無効化して下さい。
 * - eval：改造で 文字スタイル(CSS) のカスタマイズが可能です。
 *        「設定名」「文字スタイル」をお好きに改造して下さい。
 * - 使い方の例、サンプルプロジェクト
 *   https://tm-misfit.hateblo.jp/entry/2024/01/25/101457
 * 
 * ----------------------------------------------------------------------------
 * 利用規約：
 * OK - 改変、プラグイン単体の再配布(無料)
 *      サポート対応できないため、ご自由に改変下さい。クレジット不要です。
 *      ご利用は自己責任でお願いいたします。
 * NG - プラグイン単体の有料販売(丸ごと転載し販売などトラブルを招く行為)
 * ----------------------------------------------------------------------------
 *
 @ -------------------------- パラメータ設定
 * @param logSwitch
 * @text [s] 表示スイッチ
 * @desc このスイッチがONの時のみログ表示します。
 * デバッグモードでONにするスイッチ等を設定下さい。
 * @type switch
 * @default 1
 @ --------------------------
 * @param tableVariable1
 * @text [v] 1列目
 * @desc テーブル形式で表示する変数。
 * @type variable
 * @default 1
 *
 * @param tableVariable2
 * @text [v] 2列目
 * @desc テーブル形式で表示する変数。
 * @type variable
 * @default 2
 *
 * @param tableVariable3
 * @text [v] 3列目
 * @desc テーブル形式で表示する変数。
 * @type variable
 * @default 3
 *
 * @param tableVariable4
 * @text [v] 4列目
 * @desc テーブル形式で表示する変数。
 * @type variable
 * @default 4
 *
 * @param tableVariable5
 * @text [v] 5列目
 * @desc テーブル形式で表示する変数。
 * @type variable
 * @default 5
 @ --------------------------
 * @param tableVariable1Name
 * @text 1列目タイトル
 * @desc テーブル形式で表示する列のタイトル。
 * @type string
 * @default 1
 * 
 * @param tableVariable2Name
 * @text 2列目タイトル
 * @desc テーブル形式で表示する列のタイトル。
 * @type string
 * @default 2
 * 
 * @param tableVariable3Name
 * @text 3列目タイトル
 * @desc テーブル形式で表示する列のタイトル。
 * @type string
 * @default 3
 * 
 * @param tableVariable4Name
 * @text 4列目タイトル
 * @desc テーブル形式で表示する列のタイトル。
 * @type string
 * @default 4
 * 
 * @param tableVariable5Name
 * @text 5列目タイトル
 * @desc テーブル形式で表示する列のタイトル。
 * @type string
 * @default 5
 @ -------------------------- プラグインコマンド
 * @command log
 * @text ---console.log---
 * @desc 制御文字: \v[n], \s[n] (*表示のみの用途)
 * $gameVariables.value(n)等は使えません。
 * 
 *  @arg param
 *   @text log
 *   @type multiline_string
 *   @desc 制御文字: \v[n], \s[n] (*表示のみの用途)
 *   $gameVariables.value(n)等は使えません。
 *   @default
 * 
 *  @arg logType
 *   @text console.
 *   @desc log: 通常のログ形式, warn: 警告形式, error: エラー形式
 *   空白の場合、「log」になります。
 *   @type select
 *   @default log
 *   @option log
 *   @option warn
 *   @option error
 * 
 *  @arg style
 *   @text text-style
 *   @desc 不要な場合、空白でOKです。
 *   直接CSS記述する場合、最後の「;」を消さないで下さい。
 *   @type combo
 *   @default 
 *   @option gray *文字色：灰色
 *   @option 背景：黒
 *   @option 背景：赤
 *   @option background-color: #4d9bc1; color: black;
 @ --------------------------
 * @command log_eval
 * @text ---console.log---(eval)
 * @desc 制御文字変換無しタイプ。console.log('★');と同感覚です。
 * $gameVariables.value()等が使えます。
 * 
 *  @arg param
 *   @text log
 *   @type multiline_string
 *   @desc 色：black,red,green,yellow,blue,magenta,cyan,white,reset
 *   例) cyan + 'test' + reset
 *   @default
 * 
 *  @arg logType
 *   @text console.
 *   @desc log: 通常のログ形式, warn: 警告形式, error: エラー形式
 *   空白の場合、「log」になります。
 *   @type select
 *   @default log
 *   @option log
 *   @option warn
 *   @option error
 * 
 *  @arg style
 *   @text text-style
 *   @desc 不要な場合、空白でOKです。
 *   直接CSS記述する場合、最後の「;」を消さないで下さい。
 *   @type combo
 *   @default 
 *   @option gray *文字色：灰色
 *   @option 背景：黒
 *   @option 背景：赤
 *   @option background-color: #4d9bc1; color: black;
 @ --------------------------
 * @command table
 * @text ---console.table---(変数表示)
 * @desc パラメータ設定の変数をテーブル形式で表示します。
 *
 */

(() => {
  'use strict';
  const script = document.currentScript;
  const param = PluginManagerEx.createParameter(script);
  const pluginName = script.src.split("/").pop().replace(/\.js$/, "");
  function checkLogSwitch() {
    return ($gameSwitches.value(param.logSwitch)) ? true : false;
  }
  // combo
  function getCombo(value) {
    if (value === undefined || !value.includes("*")) {
      return String(value);
    }
    return String(value.split("*")[0].trim());
  }

  /* ---------------text-style---------------
     - カスタマイズしてお楽しみください。
     - 最後の「;」を消さないようご注意下さい。
     ---------------------------------------- */
  function setTextStyle(string) {
    switch (string) {
      case 'gray':
      case '字：灰色':
        return 'color:#939393;';
        break;
      case '背景：黒':
        return 'background-color: #000000; color: #ffffff;';
        break;
      case '背景：赤':
        return 'background-color: #ce0000; color: #ffffff;';
        break;
      case '囲み':
        return 'display: inline-block; border: solid 2px #454545;';
        break;
      case 'ブラー':
        return 'color: #fff; text-shadow: 2px 2px 10px #c14d9e, -2px 2px 10px #c14d9e, 2px -2px 10px #c14d9e, -2px -2px 10px #c14d9e;';
        break;
      default:
        return string;
        break;
    }
  }
  /* --------------制御文字の登録--------------
     - eval限定
     - 文字スタイルを選択した場合は無視されます。
     - 1ずつの適応になります。(red+B=redのみ適応)
     ---------------------------------------- */
  var reset = '\x1b[0m';
  // text-color
  var black = '\x1b[30m';
  var red = '\x1b[31m';
  var green = '\x1b[32m';
  var yellow = '\x1b[33m';
  var blue = '\x1b[34m';
  var magenta = '\x1b[35m';
  var cyan = '\x1b[36m';
  var white = '\x1b[37m';
  var def = '\x1b[39m';
  // background-color
  var bblack = '\x1b[40m';
  var bred = '\x1b[41m';
  var bgreen = '\x1b[42m';
  var byellow = '\x1b[43m';
  var bblue = '\x1b[44m';
  var bmagenta = '\x1b[45m';
  var bcyan = '\x1b[46m';
  var bwhite = '\x1b[47m';
  var bdef = '\x1b[49m';
  // style
  var B = '\x1b[1m'; // 太字
  var U = '\x1b[4m'; // 下線


  // =============================================================================
  // PluginCommand　
  // =============================================================================

  // log
  PluginManagerEx.registerCommand(script, 'log', function (args) {
    if ($gameTemp.isPlaytest()) {
      const text = args.param;
      const style = setTextStyle(getCombo(args.style));
      switch (args.logType) {
        case 'warn':
          if (args.param !== "" && checkLogSwitch()) console.warn('%c' + text, style);
          break;
        case 'error':
          if (args.param !== "" && checkLogSwitch()) console.error('%c' + text, style);
          break;
        default:
          if (args.param !== "" && checkLogSwitch()) console.log('%c' + text, style);
          break;
      }
      process.stdout.write("\x1b[0m"); // reset
    }
  });

  // log eval
  PluginManager.registerCommand(pluginName, "log_eval", function (args) {
    if ($gameTemp.isPlaytest()) {
      const text = eval(args.param);
      const style = setTextStyle(getCombo(args.style));
      switch (args.logType) {
        case 'warn':
          if (args.param !== "" && checkLogSwitch()) console.warn('%c' + text, style);
          break;
        case 'error':
          if (args.param !== "" && checkLogSwitch()) console.error('%c' + text, style);
          break;
        default:
          if (args.param !== "" && checkLogSwitch()) console.log('%c' + text, style);
          break;
      }
      process.stdout.write("\x1b[0m"); // reset
    }
  });

  // table
  PluginManagerEx.registerCommand(script, 'table', function (args) {
    if ($gameTemp.isPlaytest()) {
      const v1 = $gameVariables.value(param.tableVariable1);
      const v2 = $gameVariables.value(param.tableVariable2);
      const v3 = $gameVariables.value(param.tableVariable3);
      const v4 = $gameVariables.value(param.tableVariable4);
      const v5 = $gameVariables.value(param.tableVariable5);
      const v1name = param.tableVariable1Name || 1;
      const v2name = param.tableVariable2Name || 2;
      const v3name = param.tableVariable3Name || 3;
      const v4name = param.tableVariable4Name || 4;
      const v5name = param.tableVariable5Name || 5;
      const table = [
        { [v1name]: v1, [v2name]: v2, [v3name]: v3, [v4name]: v4, [v5name]: v5 },
      ];
      if (checkLogSwitch()) console.table(table);
    }
  });



})();
