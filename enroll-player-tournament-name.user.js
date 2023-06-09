// ==UserScript==
// @name         Melee Event Name in Enroll Player Modal
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Show the current tournament name in the header of the "enroll player" modal on mtgmelee.
// @author       Dan Collins <dcollins@batwing.tech>
// @updateURL    https://raw.githubusercontent.com/dcollinsn/melee-tampermonkey/main/enroll-player-tournament-name.user.js
// @downloadURL  https://raw.githubusercontent.com/dcollinsn/melee-tampermonkey/main/enroll-player-tournament-name.user.js
// @website      https://github.com/dcollinsn/melee-tampermonkey
// @match        https://mtgmelee.com/Tournament/Control/*
// @match        https://melee.gg/Tournament/Control/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mtgmelee.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $('#add-player-modal .modal-header h5').text($('.tournament-details-name-field').first().text() + " - Enroll a player")
})();
