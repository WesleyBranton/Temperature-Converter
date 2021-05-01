/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Find and mark valid temperatures on page
 * @async
 */
async function findTemperatures() {
    const settings = await browser.storage.local.get('allowAutoAdvanced');
    const context = document.body;
    const instance = new Mark(context);
    const OPTIONS = {
        element: 'span',
        className: 'firefoxtempconvertedcomplete'
    };
    let regex;

    if (settings.allowAutoAdvanced) {
        regex = /-?(\d*\.?\d+|\d{1,3}(,\d{3})*(\.\d+)?)\s?\°?\s?(C|F|c|f)(?!([\da-zA-Z]))/;
    } else {
        regex = /-?(\d*\.?\d+|\d{1,3}(,\d{3})*(\.\d+)?)\s?\°\s?(C|F|c|f)(?!([\da-zA-Z]))/;
    }

    await instance.markRegExp(regex, OPTIONS);
    convertFound();
}

/**
 * Convert all found temperatures
 * @async
 */
async function convertFound() {
    const temperatures = document.getElementsByClassName('firefoxtempconvertedcomplete');

    for (let temperature of temperatures) {
        const converted = await browser.runtime.sendMessage({
            type: 'convert',
            parameter: temperature.textContent
        });

        if (converted == null) {
            temperature.setAttribute('data-original', temperature.textContent);
            undoElement(temperature);
        } else {
            temperature.setAttribute('data-original', temperature.textContent);
            temperature.textContent = converted;
        }
    }
}

findTemperatures();