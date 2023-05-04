// ==UserScript==
// @name         Melee Autorefresh
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Refresh the list of tournaments, players, or matches every 30 seconds on mtgmelee.
// @author       Dan Collins <dcollins@batwing.tech>
// @updateURL    https://raw.githubusercontent.com/dcollinsn/melee-tampermonkey/main/autorefresh.user.js
// @downloadURL  https://raw.githubusercontent.com/dcollinsn/melee-tampermonkey/main/autorefresh.user.js
// @website      https://github.com/dcollinsn/melee-tampermonkey
// @match        https://mtgmelee.com/Hub/View/*
// @match        https://mtgmelee.com/Tournament/Control/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mtgmelee.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        $('.data-tables-refresh-button').click()
    }, 30000);
})();
