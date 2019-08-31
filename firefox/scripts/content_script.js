/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Convert found temperatures
function convertTemps() {
    var temps = document.getElementsByClassName('firefoxtempconvertedcomplete');
    for (i = 0; i < temps.length; i++) {
        var temp;
        var unit;
        var unitVerify = temps[i].textContent.toUpperCase();
        
        if (unitVerify.search('F') > -1) {
            // If temperature is fahrenheit
            unit = '\u00B0' + 'C';
            unitVerify = getNumber(unitVerify);
            temp = ftoc(unitVerify);
        } else if (unitVerify.search('C') > -1) {
            // If temperature is celsius
            unit = '\u00B0' + 'F';
            unitVerify = getNumber(unitVerify);
            temp = ctof(unitVerify);
        }
        
        temps[i].textContent += ' (' + temp + unit + ')';
    }
}

// Scan page for temperatures
var context = document.body;
var instance = new Mark(context);
var options = {
    element: 'span',
    className: 'firefoxtempconvertedcomplete'
};
instance.markRegExp(/-?\d*\.?\d+\s?\°\s?(C|F|c|f)/, options);
convertTemps();