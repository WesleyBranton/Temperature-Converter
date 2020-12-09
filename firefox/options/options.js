/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Save settings
function saveOptions() {
    browser.storage.local.set({
        allowAuto: toBoolean(document.settings.allowAuto.value),
        allowAutoAdvanced: toBoolean(document.settings.allowAutoAdvanced.value)
    });
    updateUI();
}

// Load settings from storage
function restoreOptions(item) {
    document.settings.allowAuto.value = item.allowAuto;
    document.settings.allowAutoAdvanced.value = item.allowAutoAdvanced;
    updateUI();
}

// Convert string to boolean
function toBoolean(string) {
    return string == 'true';
}

// Updates the UI based on the user settings
function updateUI() {
    const allowAutoEnabled = toBoolean(document.settings.allowAuto.value);
    for (i = 0; i < document.settings.allowAutoAdvanced.length; i++) {
        document.settings.allowAutoAdvanced[i].disabled = !allowAutoEnabled;
        document.settings.allowAutoAdvanced[i].title = (!allowAutoEnabled) ? "Automatically convert temperatures must be allowed" : "";
    }
}

browser.storage.local.get(['allowAuto', 'allowAutoAdvanced'], restoreOptions);
document.querySelector('form').addEventListener('change', saveOptions);