/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Undo previous conversion
 * @param {number} target
 */
function undo(target) {
    const element = selectElement(target);
    if (element != null) {
        const text = document.createTextNode(element.getAttribute('data-original'));
        element.replaceWith(text);
    }
}

/**
 * Check targetted element can be undone
 * @param {number} target
 * @returns Can undo
 */
function canUndo(target) {
    return selectElement(target) != null;
}

/**
 * Get the targetted HTML element
 * @param {number} target
 * @returns HTML element
 */
function selectElement(target) {
    const element = browser.menus.getTargetElement(target);
    return (element.className == 'firefoxtempconvertedcomplete') ? element : null;
}