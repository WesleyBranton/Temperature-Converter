/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

function randomDemo() {
    var output1 = document.getElementById('tempconverttest1');
    var output2 = document.getElementById('tempconverttest2');
    var temp = Math.floor((Math.random() * 100));
    var unit = Math.floor((Math.random() * 2) + 1);
    if (unit == 2) {
        unit = 'C';
    } else {
        unit = 'F';
    }
    output1.textContent = temp;
    output2.textContent = '\u00B0' + unit;
}

window.onload = randomDemo();