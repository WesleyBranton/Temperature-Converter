/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

function saveOptions() {
    if (document.settings.allowAuto.value == 'true') {
        var allowAuto = true;
    } else {
        var allowAuto = false;
    }
    browser.storage.local.set({
        allowAuto: allowAuto
    });
}

function restoreOptions(item) {
    document.settings.allowAuto.value = item.allowAuto;
}

browser.storage.local.get('allowAuto', restoreOptions);
document.querySelector('form').addEventListener('change', saveOptions);