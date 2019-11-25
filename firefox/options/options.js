/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Save settings
function saveOptions() {
    browser.storage.local.set({
        allowAuto: toBoolean(document.settings.allowAuto.value)
    });
}

// Load settings from storage
function restoreOptions(item) {
    document.settings.allowAuto.value = item.allowAuto;
}

// Convert string to boolean
function toBoolean(string) {
    if (string == 'true') {
        return true;
    } else {
        return false;
    }
}

browser.storage.local.get('allowAuto', restoreOptions);
document.querySelector('form').addEventListener('change', saveOptions);