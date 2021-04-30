/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Convert user's selected text
 * @async
 */
async function convertSelection() {
    const selection = window.getSelection();

    if (selection) {
        // Checks if user has already converted
        const convertedElements = document.getElementsByClassName('firefoxtempconvertedcomplete');
        for (let element of convertedElements) {
            if (selection.containsNode(element, true)) {
                browser.runtime.sendMessage({
                    type: 'error',
                    text: 'The temperature you have selected has already been converted using this extension.\n\nPlease select a different temperature.'
                });
                return;
            }
        }

        // Get converted temperature
        const converted = await browser.runtime.sendMessage({
            type: 'convert',
            parameter: selection.toString()
        });

        if (converted == null) return;

        // Outputs converted temperature
        const range = selection.getRangeAt(0);
        const output = document.createElement('span');
        output.className = 'firefoxtempconvertedcomplete';
        output.setAttribute('data-original', selection.toString());
        output.appendChild(document.createTextNode(converted));
        range.deleteContents();
        range.insertNode(output);
        window.getSelection().removeAllRanges();
    }
}