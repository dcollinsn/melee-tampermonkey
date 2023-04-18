// ==UserScript==
// @name         Melee Event Name in Tournament Controller
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add tournament name to the page title on the mtgmelee Tournament Controller.
// @author       Dan Collins <dcollins@batwing.tech>
// @website      https://github.com/dcollinsn/melee-tampermonkey
// @match        https://mtgmelee.com/Tournament/Control/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mtgmelee.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $('head title').text($('.tournament-details-name-field').first().text())
})();