// ==UserScript==
// @name         Melee.gg - Copy Email Cells
// @version      1.2
// @description  Make plain email cells in the players table clickable; clicking copies the email to clipboard.
// @match        https://melee.gg/Tournament/Control/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    td.email-copyable {
      cursor: pointer !important;
      position: relative;
    }
    td.email-copyable:focus {
      outline: 2px solid #4a90e2;
      outline-offset: -2px;
    }
    td.email-copyable.copied {
      box-shadow: inset 0 0 0 9999px rgba(76, 175, 80, 0.15);
      transition: box-shadow 0.2s ease-in-out;
    }
    td.email-copyable.copied::after {
      content: "Copied!";
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      font-weight: 600;
      background: rgba(0,0,0,0.75);
      color: #fff;
      padding: 2px 6px;
      border-radius: 4px;
      pointer-events: none;
    }
    input[type=number][data-name=FixedTable] {
      -moz-appearance: textfield;
      padding: 0;
    }
  `);

  const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

  let boundTable = null;

  function isEmailOnlyCell(node) {
    if (!(node instanceof HTMLElement)) return false;
    if (node.tagName !== 'TD') return false;
    if (node.closest('#tournament-players-table tbody') == null) return false;

    const text = node.textContent.trim();
    if (!EMAIL_RE.test(text)) return false;

    // "just an email address": no child elements and no extra text nodes beyond the email
    if (node.childElementCount > 0) return false;
    return true;
  }

  function enhanceCell(td) {
    // Lightweight enhancement each time we hover/focus a qualifying cell
    if (!td.classList.contains('email-copyable')) {
      td.classList.add('email-copyable');
      td.title = 'Click to copy email';
      td.setAttribute('role', 'button');
      td.setAttribute('tabindex', '0');
    }
  }

  function copyText(text) {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text);
    }
    try {
      GM_setClipboard(text, { type: 'text', mimetype: 'text/plain' });
      return Promise.resolve();
    } catch {
      return Promise.reject(new Error('Clipboard API unavailable'));
    }
  }

  function flashCopied(td) {
    td.classList.add('copied');
    td.setAttribute('aria-live', 'polite');
    td.setAttribute('aria-label', 'Email copied to clipboard');
    setTimeout(() => td.classList.remove('copied'), 1200);
  }

  async function handleCopyFromTarget(target) {
    const td = target.closest('td');
    if (!td || !isEmailOnlyCell(td)) return;
    enhanceCell(td);
    const email = td.textContent.trim();
    try {
      await copyText(email);
      flashCopied(td);
        const row = td.closest('tr');
        const acknowledged = row?.querySelector('input[type="checkbox"][name="Acknowledged"]');
        if (acknowledged && !acknowledged.checked && !acknowledged.disabled) {
            acknowledged.click();
        }
    } catch {
      // fallback: select for manual copy
      const range = document.createRange();
      range.selectNodeContents(td);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      td.title = 'Press Ctrl/Cmd+C to copy';
    }
  }

  function bindTable(table) {
    if (!table || boundTable === table) return;

    // Unbind old if needed
    if (boundTable) {
      boundTable.removeEventListener('click', onTableClick, true);
      boundTable.removeEventListener('keydown', onTableKeydown, true);
      boundTable.removeEventListener('mouseover', onTableMouseover, true);
      boundTable.removeEventListener('focusin', onTableFocusin, true);
    }

    table.addEventListener('click', onTableClick, true);
    table.addEventListener('keydown', onTableKeydown, true);
    table.addEventListener('mouseover', onTableMouseover, true);
    table.addEventListener('focusin', onTableFocusin, true);
    boundTable = table;
  }

  function onTableClick(e) {
    handleCopyFromTarget(e.target);
  }

  function onTableKeydown(e) {
    // Make Enter/Space activate copy when the TD is focused
    if (e.key === 'Enter' || e.key === ' ') {
      const td = e.target;
      if (td instanceof HTMLElement && td.tagName === 'TD' && isEmailOnlyCell(td)) {
        e.preventDefault();
        handleCopyFromTarget(td);
      }
    }
  }

  function onTableMouseover(e) {
    const td = e.target.closest?.('td');
    if (td && isEmailOnlyCell(td)) {
      enhanceCell(td);
    }
  }

  function onTableFocusin(e) {
    const td = e.target.closest?.('td');
    if (td && isEmailOnlyCell(td)) {
      enhanceCell(td);
    }
  }

  function ensureBound() {
    // Find (or re-find) the table and (re)bind listeners.
    const table = document.querySelector('#tournament-players-table');
    if (table) bindTable(table);
  }

  // Observe DOM changes to rebind if the table is replaced
  const observer = new MutationObserver(() => {
    // If boundTable was removed from DOM, or a new one appeared, rebind.
    if (!boundTable || !document.contains(boundTable)) {
      ensureBound();
    }
  });

  function init() {
    ensureBound();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
