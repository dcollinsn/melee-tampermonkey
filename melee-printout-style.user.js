// ==UserScript==
// @name         Melee Printout Formatter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Fixes styling of Melee printouts for accurate pagination
// @author       Dan Collins <dcollins@batwing.tech>
// @updateURL    https://raw.githubusercontent.com/dcollinsn/melee-tampermonkey/main/melee-printout-style.user.js
// @downloadURL  https://raw.githubusercontent.com/dcollinsn/melee-tampermonkey/main/melee-printout-style.user.js
// @website      https://github.com/dcollinsn/melee-tampermonkey
// @match        https://melee.gg/Tournament/MultiPrint/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mtgmelee.com
// @grant        GM_addStyle
// @connect      self
// ==/UserScript==

(function() {
    'use strict';

  GM_addStyle(`
  @page {
      size: Letter portrait;
      margin: 0.25in;
  }

  html,
  body {
      margin: 0;
      padding: 0;
  }

  body {
      width: auto;
  }

  @media print {
      .page {
          width: auto;
          height: auto;
          min-height: 0;
      }

      .page:not(:last-child) {
          break-after: page;
          page-break-after: always;
      }

      .pairing-table thead {
          display: table-header-group;
      }

      .pairing-table tr {
          break-inside: avoid;
          page-break-inside: avoid;
      }
      .pairing-table {
          line-height: 1.2;
      }

      .pairing-table th,
      .pairing-table td {
          padding-top: 0;
          padding-bottom: 0;
      }
  }


  `);

})();
