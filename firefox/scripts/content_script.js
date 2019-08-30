/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

function convertTemps() {
	var temps = document.getElementsByClassName('firefoxtempconvertedcomplete');
	for (i = 0; i < temps.length; i++) {
		temps[i].textContent += ' (CONVERTED)';
	}
}

var context = document.body;
var instance = new Mark(context);
var options = {
	"element": "span",
	"className": "firefoxtempconvertedcomplete"
};
instance.markRegExp(/-?\d*\.?\d+\s?\°\s?(C|F|c|f)/, options);
convertTemps();