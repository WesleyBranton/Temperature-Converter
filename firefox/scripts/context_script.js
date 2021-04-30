/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Convert the user's text selection
 * @returns On error
 */
function convertUserSelection() {
    if (window.getSelection()) {
        // Creates variables
        let value, unit;
        
        // Stores user selection & stores as text string
        const selection = window.getSelection();
        const originalSelection = selection.toString();
        let text = originalSelection.toUpperCase();
        
        // Checks if user has already converted
        const convertedElements = document.getElementsByClassName('firefoxtempconvertedcomplete');
        for (let element of convertedElements) {
            if (selection.containsNode(element, true)) {
                browser.runtime.sendMessage({
                    type: 'warning',
                    error: 'The temperature you have selected has already been converted using this extension.\n\nPlease select a different temperature.'
                });
                return;
            }
        }
        
        // Checks for extra characters after user selection
        let hasExtraCharacters = true;
        let verificationStep = 1;
        do {
            const lastChar = text.charAt(text.length - verificationStep)
            if (lastChar == ' ') { // If characters after temperature selection are spaces
                verificationStep++;
            } else if (lastChar == 'F' || lastChar == 'C') { // If there are no extra characters after the selection
                hasExtraCharacters = false;
            } else { // If there are extra characters after selection
                browser.runtime.sendMessage({
                    type: 'error',
                    error: 'The temperature you have selected is invalid.\n\nPlease select a different temperature.'
                });
                return;
            }
        } while (hasExtraCharacters == true);
        
        if (selection.rangeCount > 0) {
            if (text.includes('F')) { // If temperature is fahrenheit
                unit = '\u00B0' + 'C';
                text = getNumber(text);
                value = convertTemperature(text, 'F', 'C');
            } else if (text.includes('C')) { // If temperature is celsius
                unit = '\u00B0' + 'F';
                text = getNumber(text);
                value = convertTemperature(text, 'C', 'F');
            } else { // If temperature is not valid
                browser.runtime.sendMessage({
                    type: 'error',
                    error: 'The temperature you have selected is invalid.\n\nPlease select a different temperature.'
                });
                return;
            }
            // Outputs converted temperature
            const range = selection.getRangeAt(0);
            const output = document.createElement('span');
            output.className = 'firefoxtempconvertedcomplete';
            output.appendChild(document.createTextNode(originalSelection + ' (' + value + unit + ') '));
            range.deleteContents();
            range.insertNode(output);
            window.getSelection().removeAllRanges();
            
            // Usage data count
            browser.storage.local.get('usageData', updateStatistics);
        }
    }
}

/**
 * Update usage statistics
 * @param {Object} data
 */
function updateStatistics(data) {
    if (data.usageData) { // If there is already data setup
        if (parseInt(data.usageData.show) == 1) { // If the user has not already clicked to rate the add-on
            const current = parseInt(data.usageData.times) + 1;
            browser.storage.local.set({
                usageData: {
                    times: current.toString(),
                    show: '1'
                }
            });
            if (current % 50 == 0) { // If the user needs to be reminded to rate the add-on
                browser.runtime.sendMessage({
                    type: 'rate',
                    text: 'Are you liking this add-on? Please tell Firefox users how great this add-on is!\n\nClick this notification to open the Firefox add-on listing in a new window.'
                });
            }
        }
    } else { // If there is no data setup
        browser.storage.local.set({
            usageData: {
                times: '1',
                show: '1'
            }
        });
    }
}

// Starts conversion function
convertUserSelection();