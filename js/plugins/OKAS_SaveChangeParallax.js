/* ==============================================================================
OKAS_SaveChangeParallax.js
SNS： https://tm-misfit.hateblo.jp
=================================================================================
更新履歴：
2024/01/28 Ver.1.2.2  リファクタリング。予約遠景と保存遠景が無い場合の挙動を修正。デフォルトに戻すプラグインコマンドを追加。
2024/01/25 Ver.1.2.1  文言等を修正。利用規約の微改定。使い方の例(URL)を追加。
2022/08/08 Ver.1.2.0　遠景の予約機能を追加。
2022/08/03 Ver.1.0.0　初版
*/
/*:
 * @plugindesc 遠景の保存、復元、予約
 * @author Okiashi
 * @target MZ
 * @url https://raw.githubusercontent.com/okiashi/RPGMakerMZ/main/OKAS_SaveChangeParallax.js
 * @help OKAS_SaveChangeParallax.js (2024/01/28 Ver.1.2.2)
 *
 * 概要：
 * プラグインコマンドで遠景の保存、復元、予約が行えます。
 * ループやスクロールの設定も含まれます。
 * 「一時的に遠景を変更し、ワンコマンドで元に戻したい」
 * 「遠景のデフォルト設定のようなものを設けたい」
 * 「遠景の変更を使った汎用的なイベントを組みたい」 etc...
 *
 * プラグインコマンド：
 * 　[パラメータ変数1]
 * 　 1.現在の遠景を保存し、変更
 * 　 2.現在の遠景を保存 (保存のみ)
 * 　 3.遠景の復元 (保存遠景が無い場合、データベース通りに復元します)
 * 　[パラメータ変数2]
 * 　 4.遠景の予約 (予約のみ)
 *  　5.遠景の予約を反映 (予約遠景が無い場合、何も起こりません)
 *   [Ver.1.2.2]
 *    6.データベース遠景に戻す
 *
 * メモ：
 * - 「イベントコマンド」や「スクリプト」で遠景の変更をした分は
 *   復元ができませんのでご注意ください。
 *   復元させたい遠景は、当プラグインコマンド経由で変更を行って下さい。
 * - 「遠景なし」の復元を許可
 *   true:  元の遠景が「なし」でも、「なし」の状態に復元します。
 *   false: 元の遠景が「なし」の時、何もせず終了します。
 * - 当プラグインコマンド・ツクールMZのイベントコマンドによる「遠景の変更」は
 *   一時的な性質です。場所移動などでデータベース通りの遠景に戻ります。
 *   演出等で一時的に遠景を変更・復元したい場合にご利用下さい。
 *   遠景を恒久的に変更するには別のプラグインをご利用下さいませ。
 * - 使い方の例
 *   https://tm-misfit.hateblo.jp/entry/2022/08/03/180051
 *   https://tm-misfit.hateblo.jp/entry/2022/08/08/034137
 *
 * ----------------------------------------------------------------------------
 * 利用規約：
 * OK - 改変、プラグイン単体の再配布(無料)
 *      サポート対応できないため、ご自由に改変下さい。クレジット不要です。
 *      ご利用は自己責任でお願いいたします。
 * NG - プラグイン単体の有料販売(丸ごと転載し販売などトラブルを招く行為)
 * ----------------------------------------------------------------------------
 *
 @ -------------------------- パラメータ
 * @param Save Parallax Variable
 * @text [変数1] 現在の遠景を保存
 * @desc 現在の遠景情報を格納する変数です。
 * 指定がない場合は、変数1がセットされます。
 * @type variable
 * @default 1
 *
 * @param Set Parallax Variable
 * @text [変数2] 遠景の予約
 * @desc 遠景情報を格納する変数です。
 * 指定がない場合は、変数2がセットされます。
 * @type variable
 * @default 2
 *
 * @param Reset Permission
 * @text 遠景「なし」の復元をするか
 * @desc true: 元の遠景がなしの時も復元を行います。(default)
 * false: 元の遠景がなしの時、復元を行いません。
 * @type boolean
 * @default true
 *
 @ -------------------------- プラグインコマンド
 * @command SaveChangeParallax
 * @text 現在の遠景を保存し、変更
 * @desc 現在の遠景を保存してから変更します。
 * スクロールなどの設定も保存されます。
 *
 * @arg Image
 * @text 遠景ピクチャ
 * @type file
 * @dir img/parallaxes/
 * @desc 遠景をこのピクチャに変更します。
 * (空白にすると「遠景なし」に応用可能です)
 * @default
 *
 * @arg LoopX
 * @text ループX
 * @type boolean
 * @desc 横方向にループしますか？
 * @default false
 *
 * @arg LoopY
 * @text ループY
 * @type boolean
 * @desc 縦方向にループしますか？
 * @default false
 *
 * @arg Sx
 * @text X方向のスクロール速度
 * @type string
 * @desc 横方向のスクロール速度。(負の数で右)
 * @default 0
 *
 * @arg Sy
 * @text Y方向のスクロール速度
 * @type string
 * @desc 縦方向のスクロール速度。(負の数で下)
 * @default 0
 *
 @ --------------------------
 * @command SaveParallax
 * @text 現在の遠景を保存 (保存のみ)
 * @desc このマップの遠景を保存します。
 * スクロールなどの設定も保存します。
 *
 @ --------------------------
 * @command RestorationParallax
 * @text 遠景を復元
 * @desc 遠景を変更前に戻します。
 * (保存遠景が無い場合、データベース通りに復元します)
 *
 @ --------------------------
 * @command SetParallax
 * @text 遠景を予約 (予約のみ)
 * @desc 遠景情報を予約保存します。
 * お好きなタイミングで「予約を反映」を実行して下さい。
 *
 * @arg Image
 * @text 予約遠景ピクチャ
 * @type file
 * @dir img/parallaxes/
 * @desc 遠景をこのピクチャに変更します。
 * (空白にすると「遠景なし」に応用可能です)
 * @default
 *
 * @arg LoopX
 * @text ループX
 * @type boolean
 * @desc 横方向にループしますか？
 * @default false
 *
 * @arg LoopY
 * @text ループY
 * @type boolean
 * @desc 縦方向にループしますか？
 * @default false
 *
 * @arg Sx
 * @text X方向のスクロール速度
 * @type string
 * @desc 横方向のスクロール速度。(負の数で右)
 * @default 0
 *
 * @arg Sy
 * @text Y方向のスクロール速度
 * @type string
 * @desc 縦方向のスクロール速度。(負の数で下)
 * @default 0
 *
 @ --------------------------
 * @command RestorationSetParallax
 * @text 遠景の予約を反映
 * @desc 遠景を予約した内容に変更します。
 * (予約遠景が無い場合、何も起こりません)
 * 
 @ --------------------------
 * @command ResetParallax
 * @text データベース遠景に戻す
 * @desc 遠景をデータベース通りに戻します。
 *
 */

(() => {
  'use strict';
  const script = document.currentScript;
  const pluginName = script.src.split("/").pop().replace(/\.js$/, "");
  const parameters = PluginManager.parameters(pluginName);
  const SaveParallaxV = parseInt(parameters['Save Parallax Variable']) || 1;
  const SetParallaxV = parseInt(parameters['Set Parallax Variable']) || 2;
  const isResetPre = String(parameters['Reset Permission']) === 'true';
  // boolean
  function toBoolean(str) {
    return (str == 'true') ? true : false;
  }
  // set p{args}
  function setArgsP(args) {
    const p = {};
    p.pict = String(args.Image) || "";
    p.LoopX = toBoolean(args.LoopX) || false;
    p.LoopY = toBoolean(args.LoopY) || false;
    p.Sx = Number(args.Sx) || 0;
    p.Sy = Number(args.Sy) || 0;
    return [p.pict, p.LoopX, p.LoopY, p.Sx, p.Sy];
  }
  // changeParallax(v)
  function changeParallax_OKAS(v) {
    if (v[0] || (v[0] === "" && isResetPre)) $gameMap.changeParallax(v[0], v[1], v[2], v[3], v[4]);
  }
  // reset
  function resetParallax_OKAS() {
    $gameMap.changeParallax($dataMap.parallaxName, $dataMap.parallaxLoopX, $dataMap.parallaxLoopY, $dataMap.parallaxSx, $dataMap.parallaxSy);
  }

  // =============================================================================
  // プラグインコマンド
  // =============================================================================

  // 現在の遠景を保存し、変更
  PluginManager.registerCommand(pluginName, "SaveChangeParallax", function (args) {
    Game_Map.prototype.saveParallax();
    const p = setArgsP(args);
    $gameMap.changeParallax(...p);
  });

  // 現在の遠景を保存　save
  PluginManager.registerCommand(pluginName, "SaveParallax", function () {
    Game_Map.prototype.saveParallax();
  });

  // 遠景の復元
  PluginManager.registerCommand(pluginName, "RestorationParallax", function () {
    const v = $gameVariables.value(SaveParallaxV);
    v ? changeParallax_OKAS(v) : resetParallax_OKAS();
  });

  // 遠景の予約 set
  PluginManager.registerCommand(pluginName, "SetParallax", function (args) {
    const p = setArgsP(args);
    $gameVariables.setValue(SetParallaxV, p);
  });

  // 遠景の予約を反映
  PluginManager.registerCommand(pluginName, "RestorationSetParallax", function () {
    const v = $gameVariables.value(SetParallaxV);
    if (v) changeParallax_OKAS(v);
  });

  // データベース遠景に戻す
  PluginManager.registerCommand(pluginName, "ResetParallax", function () {
    resetParallax_OKAS();
  });

  // saveParallax() --- $dataMap でなく現在の遠景情報を保存
  // ----------------------------------------------------
  Game_Map.prototype.saveParallax = function () {
    $gameVariables.setValue(SaveParallaxV, [$gameMap.parallaxName(), $gameMap._parallaxLoopX, $gameMap._parallaxLoopY, $gameMap._parallaxSx, $gameMap._parallaxSy]);
  };


})();
