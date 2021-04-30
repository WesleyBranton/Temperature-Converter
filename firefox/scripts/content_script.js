/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Convert found temperatures
 */
function convertTemperatures() {
    const temperatures = document.getElementsByClassName('firefoxtempconvertedcomplete');

    for (let temperature of temperatures) {
        let value, unit;
        let text = temperature.textContent.toUpperCase();
        
        if (text.includes('F')) { // If temperature is fahrenheit
            unit = '\u00B0' + 'C';
            text = getNumber(text);
            value = convertTemperature(text, 'F', 'C');
        } else if (text.includes('C')) { // If temperature is celsius
            unit = '\u00B0' + 'F';
            text = getNumber(text);
            value = convertTemperature(text, 'C', 'F');
        }
        
        temperature.textContent += ' (' + value + unit + ')';
    }
}

// Scan page for temperatures
const context = document.body;
const instance = new Mark(context);
const OPTIONS = {
    element: 'span',
    className: 'firefoxtempconvertedcomplete'
};
let regex;
browser.storage.local.get('allowAutoAdvanced', (data) => {
    if (data.allowAutoAdvanced) regex = /-?\d*\.?\d+\s?\°?\s?(C|F|c|f)(?!([\da-zA-Z]))/;
    else regex = /-?\d*\.?\d+\s?\°\s?(C|F|c|f)(?!([\da-zA-Z]))/;
    instance.markRegExp(regex, OPTIONS);
    convertTemperatures();
});