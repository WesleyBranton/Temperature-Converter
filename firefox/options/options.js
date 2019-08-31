/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

function saveOptions() {
	browser.storage.local.set({
		allowAuto: document.getElementById('allowAuto').checked
	});
}

function restoreOptions(item) {
	document.getElementById('allowAuto').checked = item.allowAuto;
}

browser.storage.local.get("allowAuto", restoreOptions);
document.querySelector("form").addEventListener("change", saveOptions);