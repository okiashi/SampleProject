/* ==============================================================================
OKAS_CustomCommand.js
SNS： https://tm-misfit.hateblo.jp
=================================================================================
更新履歴：
2024/01/25 Ver.1.0.3　コンボボックスで「:」未使用時にエラーが出ないよう修正。利用規約の微改定。使い方の例(URL)を追加。
2022/08/11 Ver.1.0.2　コモンイベントの実行タイミングを修正。
2022/08/10 Ver.1.0.1　PluginCommonBaseをベースプラグインとし、並列コモン追加。
2022/08/10 Ver.1.0.0　初版
*/
/*:
 * @plugindesc 変数代入＆コモンイベント実行をワンコマンド化
 * @author Okiashi
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://raw.githubusercontent.com/okiashi/RPGMakerMZ/main/OKAS_CustomCommand.js
 * @help OKAS_CustomCommand.js (2024/01/25 Ver.1.0.3)
 *
 * 概要：
 * ※公式プラグイン「PluginCommonBase.js」が必要です。
 * ※改変ありきのプラグインです。カスタマイズしてご利用下さい。
 * ※よく使う変数、コモンイベントが定まってきた方におすすめです。
 *
 *  「変数代入→コモンイベント実行」をプラグインコマンドで簡単にします。
 *  「よく使う変数とコモンイベントを紐づけてコマンド化したい」
 *  「よく使う変数選択を楽にしたい」 etc...
 *  おまけでマップBGMの保存/復元があります。
 *
 * プラグインコマンド：
 *   1.変数代入のみ
 *   2.変数代入&コモンイベント実行
 *   3.マップBGMの保存/復元
 * 
 * メモ：
 * - 使い方の例
 *   https://tm-misfit.hateblo.jp/entry/2022/08/10/140643
 *
 * ----------------------------------------------------------------------------
 * 利用規約：
 * OK - 改変、プラグイン単体の再配布(無料)
 *      サポート対応できないため、ご自由に改変下さい。クレジット不要です。
 *      ご利用は自己責任でお願いいたします。
 * NG - プラグイン単体の有料販売(丸ごと転載し販売などトラブルを招く行為)
 * ----------------------------------------------------------------------------
 *
 @ -------------------------- パラメータ :　***お好きにカスタマイズして下さい。***
 * @param ThisV
 * @text [例] this/実行者
 * @desc this/実行者IDを格納する変数です。
 * 0:このイベント -1:プレイヤー 1～:イベントID
 * @type variable
 * @default 1
 *
 * @param EventV
 * @text [例] eventId/イベントID
 * @desc eventId/イベントIDを格納する変数です。
 * 0:このイベント -1:プレイヤー 1～:イベントID
 * @type variable
 * @default 2
 *
 * @param TargetV
 * @text [例] targetId/ターゲットID
 * @desc targetId/ターゲットIDを格納する変数です。
 * 0:このイベント -1:プレイヤー 1～:イベントID
 * @type variable
 * @default 3
 *
 * @param StagingV
 * @text [例] 演出種別
 * @desc 演出種別を格納する変数です。
 * @type variable
 * @default 4
 *
 * @param PictV
 * @text [例] 動的ピクチャ名
 * @desc 動的ピクチャ表示用のファイル名
 * 「PictureNameVariable.js」活用などに。
 * @type variable
 * @default 5
 *
 * @param MovieV
 * @text [例] 動画ファイル名
 * @desc 動画ピクチャ表示用のファイル名
 * 「MoviePicture.js」活用などに。
 * @type variable
 * @default 6
 *
 * @param MapBGM
 * @text マップBGM
 * @desc マップBGMを保存する変数です。
 * @type variable
 * @default 7
 *
 @ -------------------------- プラグインコマンド :　***お好きにカスタマイズして下さい。***
 * @command Set
 * @text 代入
 * @desc 指定した変数に値を代入します。
 *
 * @arg Variable
 * @text 変数
 * @desc **option ここによく使う変数を登録して下さい。**
 * @type combo
 * @option 1 :this/実行者　**カスタマイズして下さい**
 * @option 2 :eventId/イベントID　**カスタマイズして下さい**
 * @option 3 :targetId/ターゲットID　**カスタマイズして下さい**
 * @option 4 :演出種別　**カスタマイズして下さい**
 * @option 5 :動的ピクチャ名　**カスタマイズして下さい**
 * @option 6 :動画ファイル名　**カスタマイズして下さい**
 *
 * @arg N
 * @text 値
 * @type string
 * @desc 0:このイベント -1:プレイヤー 1～:イベントID
 * @default 0
 *
 @ -------------------------- プラグインコマンド :　***お好きにカスタマイズして下さい。***
 * @command Com1
 * @text 【v1/ここに演出名など】
 * @desc v1に値を代入し、コモンイベントを実行します。
 *
 * @arg N
 * @text 実行者/v1
 * @desc 0:このイベント -1:プレイヤー 1～:イベントID
 * @type string
 * @default 0
 *
 * @arg CommonId
 * @text コモンイベントID
 * @desc 実行するコモンイベントを指定して下さい。
 * @type common_event
 * @default 1
 *
 @ -------------------------- プラグインコマンド :　***お好きにカスタマイズして下さい。***
 * @command Com2
 * @text 【v4/ここに演出名など】
 * @desc v4に値を代入し、コモンイベントを実行します。
 *
 * @arg N
 * @text 演出種別/v4
 * @desc 必殺、氷、炎、プリシア
 * 信長アタック、リード、fire
 * @type string
 * @default 0
 *
 * @arg CommonId
 * @text コモンイベントID
 * @desc 実行するコモンイベントを指定して下さい。
 * @type combo
 * @option 1 :カットイン (キャラ名)　**カスタマイズして下さい**
 * @option 2 :必殺技 (スキル名)　**カスタマイズして下さい**
 * @option 3 :秘儀取得 (属性名)　**カスタマイズして下さい**
 *
 @ -------------------------- プラグインコマンド :　***お好きにカスタマイズして下さい。***
 * @command Pict
 * @text 【動的ピクチャ】
 * @desc 動的ピクチャ名を代入し、コモンイベント実行。
 *
 * @arg N
 * @text 動的ピクチャファイル名/v5
 * @desc 英数字、連番
 * @type string
 * @default 0
 *
 * @arg CommonId
 * @text コモンイベントID
 * @desc 実行するコモンイベントを指定して下さい。
 * @type combo
 * @option 4 :章タイトルの表示 (0～連番)　**カスタマイズして下さい**
 * @option 5 :章タイトルの表示 (ピクチャ名)　**カスタマイズして下さい**
 *
 @ -------------------------- プラグインコマンド
 * @command MapBgSave
 * @text マップBGMの保存 / Save
 * @desc 現在のマップBGMを保存します。
 *
 @ -------------------------- プラグインコマンド
 * @command MapBgRe
 * @text マップBGMの復元 / Restoration
 * @desc 保存したマップBGMに戻します。
 *
 */

(() => {
  'use strict';
  const pluginName = document.currentScript.src.split("/").pop().replace(/\.js$/, "");
  const parameters = PluginManager.parameters(pluginName);
  const ThisV = Number(parameters['ThisV']); // **カスタマイズして下さい**
  const EventV = Number(parameters['EventV']); // **カスタマイズして下さい**
  const TargetV = Number(parameters['TargetV']); // **カスタマイズして下さい**
  const StagingV = Number(parameters['StagingV']); // **カスタマイズして下さい**
  const MovieV = Number(parameters['MovieV']); // **カスタマイズして下さい**
  const PictV = Number(parameters['PictV']); // **カスタマイズして下さい**
  const BgmV = Number(parameters['MapBGM']);
  // combo　参考：NRP_CallEvent.js
  function getValue(value) {
    if (value === undefined || !value.includes(":")) {
      return value;
    }
    return value.split(":")[0].trim();
  }

  // =============================================================================
  // プラグインコマンド　　代入のみ
  // =============================================================================
  PluginManager.registerCommand(pluginName, "Set", function (args) {  // **カスタマイズして下さい**
    const v = getValue(args.Variable);
    const n = args.N;
    $gameVariables.setValue(v, n);
  });
  // =============================================================================
  // プラグインコマンド  代入&コモン
  // =============================================================================
  PluginManager.registerCommand(pluginName, "Com1", function (args) {  // **カスタマイズして下さい**
    const v = ThisV;  // **カスタマイズして下さい**
    const Id = args.CommonId;
    const eventId = this.eventId();
    settingVariables(args, v, Id, eventId); // **並列コモンの場合、以下setAndDynamicCommon(引数)にして下さい**
    this["command117"](Id); // EventCommandByCode.js
  });
  // =============================================================================
  // プラグインコマンド  代入&コモン
  // =============================================================================
  PluginManager.registerCommand(pluginName, "Com2", function (args) {  // **カスタマイズして下さい**
    const v = StagingV;  // **カスタマイズして下さい**
    const Id = getValue(args.CommonId);
    const eventId = this.eventId();
    settingVariables(args, v, Id, eventId); // **並列コモンの場合、以下setAndDynamicCommon(引数)にして下さい**
    this["command117"](Id); // EventCommandByCode.js
  });
  // =============================================================================
  // プラグインコマンド  代入&コモン Pict
  // =============================================================================
  PluginManager.registerCommand(pluginName, "Pict", function (args) {  // **カスタマイズして下さい**
    const v = PictV;  // **カスタマイズして下さい**
    const Id = getValue(args.CommonId);
    const eventId = this.eventId();
    settingVariables(args, v, Id, eventId); // **並列コモンの場合、以下setAndDynamicCommon(引数)にして下さい**
    this["command117"](Id); // EventCommandByCode.js
  });
  // =============================================================================
  // プラグインコマンド  マップBGMの保存
  // =============================================================================
  PluginManager.registerCommand(pluginName, "MapBgSave", function () {
    $gameVariables.setValue(BgmV, AudioManager.saveBgm());
  });
  // =============================================================================
  // プラグインコマンド  マップBGMの復元
  // =============================================================================
  PluginManager.registerCommand(pluginName, "MapBgRe", function () {
    AudioManager.replayBgm($gameVariables.value(BgmV));
  });
  // ------------------------------------------------------------------------------
  // settingVariables()　変数代入、thisID置換
  // ------------------------------------------------------------------------------
  const settingVariables = function (args, v, Id, eventId) {
    const n = args.N;
    if (n && n != 0) {
      $gameVariables.setValue(v, n);
    }
    if (n == 0) {
      $gameVariables.setValue(v, eventId);
    }
    else {
      // undefined , null , 空文字 , false
    }
  };
  // ------------------------------------------------------------------------------
  // Common Event
  // ------------------------------------------------------------------------------
  const _Game_Interpreter_command117 = Game_Interpreter.prototype.command117;
  Game_Interpreter.prototype.command117 = function (Id) {
    const commonEvent = $dataCommonEvents[Id];
    if (commonEvent) {
      const eventId = this.isOnCurrentMap() ? this._eventId : 0;
      this.setupChild(commonEvent.list, eventId);
    }
    return true;
  };
  const _Game_Interpreter_setupChild = Game_Interpreter.prototype.setupChild;
  Game_Interpreter.prototype.setupChild = function (list, eventId) {
    this._childInterpreter = new Game_Interpreter(this._depth + 1);
    this._childInterpreter.setup(list, eventId);
  };
  // ------------------------------------------------------------------------------
  // setAndDynamicCommon() 並列コモンの場合 イベント中、並列実行され、プレイヤーが動けるので注意です。
  // ------------------------------------------------------------------------------
  const setAndDynamicCommon = function (args, v, Id, eventId) {
    const n = args.N;
    if (n && n != 0) {
      $gameVariables.setValue(v, n);
      $gameMap.setupDynamicCommon(Id);
    }
    if (n == 0) {
      $gameVariables.setValue(v, eventId);
      $gameMap.setupDynamicCommon(Id);
    }
    else {
      // undefined , null , 空文字 , false
    }
  };

})();
