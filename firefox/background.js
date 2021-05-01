/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

let contentScript = null;

updateContentScript();
browser.runtime.onMessage.addListener(handleMessages);
browser.runtime.onInstalled.addListener(handleInstalled);
browser.storage.onChanged.addListener(handleStorageChange);
browser.menus.onClicked.addListener(handleContextMenuClicked);
browser.menus.onShown.addListener(handleContextMenuShown);
browser.menus.onHidden.addListener(() => { toggleUndoContextMenuItem(false) });

// Creates context menu item
browser.menus.create({
    id: 'convert-temp',
    title: 'Convert Selected Temperature',
    contexts: ['selection'],
    enabled: false
});

// Creates undo context menu item
browser.menus.create({
    id: 'undo-conversion',
    title: 'Undo Temperature Conversion',
    contexts: ['all'],
    visible: false
});

/**
 * Handles context menu item selected
 * @param {Object} info
 * @param {Object} tab
 */
function handleContextMenuClicked(info, tab) {
    switch (info.menuItemId) {
        case 'convert-temp':
            browser.tabs.executeScript(tab.id, {
                code: 'convertSelection();'
            });
            break;
        case 'undo-conversion':
            undoConversion(info, tab);
            break;
    }
}

/**
 * Handles incoming messages
 * @param {Object} request
 * @param {Object} sender
 * @param {Function} sendResponse
 */
function handleMessages(request, sender, sendResponse) {
    let response;

    switch (request.type) {
        case 'convert':
            response = convert(request.parameter);
            break;
    }

    sendResponse(response);
}

/**
 * Handles extension installation and updates
 * @param {Object} details
 */
 function handleInstalled(details) {
    if (details.reason == 'install') {
        browser.tabs.create({
            url: 'https://addons.wesleybranton.com/addon/temperature-converter/welcome/v1'
        });
    } else if (details.reason == 'update') {
        const previousVersion = parseFloat(details.previousVersion);
        if (previousVersion < 2.2) {
            browser.tabs.create({
                url: 'https://addons.wesleybranton.com/addon/temperature-converter/update/v2_2'
            });
        }
    }
}

/**
 * Enables/disables content script (handles auto convert)
 * @async
 */
async function updateContentScript() {
    if (contentScript) { // Removes existing content script (if necessary)
        contentScript.unregister();
    }
    
    // Load 'auto convert' setting
    const data = await browser.storage.local.get();
    
    // Sets default values if 'auto convert' or 'auto convert advanced' are not set
    if ((typeof data.allowAuto == 'undefined') || (typeof data.allowAutoAdvanced == 'undefined')) {
        const newSettings = {};
        if (typeof data.allowAuto == 'undefined') {
            newSettings.allowAuto = true;
        }
        if (typeof data.allowAutoAdvanced == 'undefined') {
            newSettings.allowAutoAdvanced = false;
        }
        browser.storage.local.set(newSettings);
        return;
    }
    
    // Enables auto convert (if requried)
    if (data.allowAuto) {
        contentScript = await browser.contentScripts.register({
            matches: ['<all_urls>'],
            excludeMatches: ['*://addons.wesleybranton.com/addon/*'], // Prevents automatic conversion on demo website
            js: [
                {file: 'lib/mark.min.js'},
                {file: 'scripts/automatic.js'}
            ],
            runAt: 'document_end',
            allFrames: true
        });
    }
}

/**
 * Handles changes to the Storage API
 * @param {Object} changes
 */
function handleStorageChange(changes) {
    // Triggers enable/disable of auto convert
    if ((typeof changes.allowAuto != 'undefined') || (typeof changes.allowAutoAdvanced != 'undefined')) {
        updateContentScript();
    }
}

/**
 * Update the undo context menu item
 * @async
 * @param {Object} info
 * @param {Object} tab
 */
async function updateUndoContextMenuItem(info, tab) {
    const enable = await browser.tabs.executeScript(tab.id, {
        code: `canUndo(${info.targetElementId});`
    });
    toggleUndoContextMenuItem(enable[0]);
}

/**
 * Toggle the undo context menu item
 * @param {boolean} enable
 */
function toggleUndoContextMenuItem(enable) {
    browser.menus.update('undo-conversion', {
        visible: enable
    }).then(() => {
        browser.menus.refresh();
    });
}

/**
 * Undo the conversion
 * @param {Object} info
 * @param {Object} tab
 */
 function undoConversion(info, tab) {
    browser.tabs.executeScript(tab.id, {
        code: `undo(${info.targetElementId});`
    });
}

/**
 * Handle context menu updates
 * @param {Object} info
 * @param {Object} tab
 */
function handleContextMenuShown(info, tab) {
    if (info.contexts.includes('selection')) {
        updateConvertContextMenuItem(info, tab);
    } else {
        updateUndoContextMenuItem(info, tab);
    }
}


/**
 * Enables/Disables convert context menu item based on user selection
 * @async
 * @param {*} info 
 * @param {*} tab 
 */
async function updateConvertContextMenuItem(info, tab) {
    const selection = await browser.tabs.executeScript(tab.id, {
        code: 'getSelection();'
    });
    let valid = false;

    if (selection[0] != null) {
        valid = isValid(selection[0].toUpperCase());
    }

    await browser.menus.update('convert-temp', {
        enabled: valid
    });
    browser.menus.refresh();
}

/**
 * Checks if user selection is a valid temperature
 * @param {String} selection
 * @returns isValid
 */
function isValid(selection) {
    let hasExtraCharacters = true;
    let verificationStep = 1;

    do { // Checks for extra characters after user selection
        const lastChar = selection.charAt(selection.length - verificationStep)
        if (lastChar == ' ') { // If characters after temperature selection are spaces
            verificationStep++;
        } else if (lastChar == 'F' || lastChar == 'C') { // If there are no extra characters after the selection
            hasExtraCharacters = false;
        } else { // If there are extra characters after selection
            return false;
        }
    } while (hasExtraCharacters);

    return (selection.includes('F') || selection.includes('C'));
}


/**
 * Convert temperature from string
 * @param {String} selection
 * @returns Converted text
 */
function convert(selection) {
    let text = selection.toUpperCase();
    let value, unit;

    if (!isValid(text)) {
        return null;
    }

    if (text.includes('F')) { // If temperature is fahrenheit
        unit = 'C';
        text = getNumber(text);
        value = convertTemperature(text, 'F', 'C');
    } else if (text.includes('C')) { // If temperature is celsius
        unit = 'F';
        text = getNumber(text);
        value = convertTemperature(text, 'C', 'F');
    }

    return `${selection} (${value}\u00B0${unit})`;
}