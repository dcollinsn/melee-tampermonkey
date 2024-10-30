// ==UserScript==
// @name         Melee Auto-Download Printouts
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automatically downloads the raw HTML of the Melee multi-print pages.
// @author       Dan Collins <dcollins@batwing.tech>
// @updateURL    https://raw.githubusercontent.com/dcollinsn/melee-tampermonkey/main/melee-auto-download-printouts.user.js
// @downloadURL  https://raw.githubusercontent.com/dcollinsn/melee-tampermonkey/main/melee-auto-download-printouts.user.js
// @website      https://github.com/dcollinsn/melee-tampermonkey
// @match        https://melee.gg/Tournament/MultiPrint/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mtgmelee.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to sanitize the filename by removing invalid characters
    function sanitizeFilename(filename) {
        // Replace invalid characters with underscores
        return filename.replace(/[\s\\/:*?"<>|]/g, '_');
    }

    // Find the td element with class "tournament-name-label"
    const tdElement = document.querySelector('td.tournament-name-label');

    let filename = 'page.html'; // Default filename

    if (tdElement) {
        // Get the text content of the td element
        let tournamentName = tdElement.textContent.trim();

        // Sanitize the tournament name for use as a filename
        tournamentName = sanitizeFilename(tournamentName);

        // Set the filename with the sanitized tournament name
        filename = `${tournamentName}.html`;
    } else {
        console.warn('Tournament name not found. Using default filename.');
    }

    // Get the raw HTML content of the page
    const htmlContent = document.documentElement.outerHTML;

    // Create a Blob from the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;

    // Set the download attribute with the filename
    link.download = filename;

    // Append the link to the document
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up by removing the link and revoking the Blob URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
})();
