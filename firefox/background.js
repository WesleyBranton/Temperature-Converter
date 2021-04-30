/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

let contentScript = null;

updateContentScript();
browser.runtime.onMessage.addListener(messageManager);
browser.runtime.onInstalled.addListener(handleInstalled);
browser.storage.onChanged.addListener(handleStorageChange);
browser.menus.onShown.addListener(updateContextMenu);
browser.menus.onHidden.addListener(() => { hideUndoContextMenuItem(false) });

// Creates context menu item
browser.menus.create({
    id: 'convert-temp',
    title: 'Convert selected temperature',
    contexts: ['selection']
});

// Creates undo context menu item
browser.menus.create({
    id: 'undo-conversion',
    title: 'Undo Conversion',
    contexts: ['all'],
    visible: false
});

// Runs the function to access the converting script with the context menu item is selected
browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case 'convert-temp':
            convertTemperature(tab.id);
            break;
        case 'undo-conversion':
            undoConversion(info, tab);
            break;
    }
});

/**
 * Runs the converting script
 * @async
 * @param {number} tabId
 */
async function convertTemperature(tabId) {
    await browser.tabs.executeScript(tabId, {
        file: '/scripts/convert.js'
    });
    await browser.tabs.executeScript(tabId, {
        file: '/scripts/context_script.js'
    });
}

function messageManager(message) {
    switch (message.type) {
        case 'notification':
            manageBrowserNotifications(message);
            break;
        case 'context':
            manageContextMenu(message);
            break;
    }
}

/**
 * Handles browser notifications
 * @param {Object} message 
 */
function manageBrowserNotifications(message) {
    browser.notifications.onClicked.removeListener(openRating);

    if (message.level == 'error') { // Notifications for error messages
        browser.notifications.create({
            type: 'basic',
            iconUrl: browser.runtime.getURL('icons/error-64.png'),
            title: 'Error converting temperature!',
            message: message.text
        });
    } else if (message.level == 'warning') { // Notifications for error messages
        browser.notifications.create({
            type: 'basic',
            iconUrl: browser.runtime.getURL('icons/warning-64.png'),
            title: 'Error converting temperature!',
            message: message.text
        });
    } else if (message.level == 'rate') { // Notifications for rating reminder
        browser.notifications.create({
            type: 'basic',
            iconUrl: browser.runtime.getURL('icons/rating-64.png'),
            title: 'Have you rated this add-on yet?',
            message: message.text
        });
        browser.notifications.onClicked.addListener(openRating);
    }
}

/**
 * Opens rating page
 */
function openRating() {
    browser.windows.create({
        url: 'https://addons.mozilla.org/en-US/firefox/addon/temperature-converter-tool/reviews/'
    });

    browser.storage.local.set({
        usageData: {
            times: '1',
            show: '0'
        }
    });
}

/**
 * Handles extension installation and updates
 * @param {Object} details
 */
function handleInstalled(details) {
    if (details.reason == 'install') {
        browser.tabs.create({
            url: 'messages/new.html'
        });
    } else if (details.reason == 'update') {
        browser.tabs.create({
            url: 'messages/update.html'
        });
    }
}

/**
 * Enables/disables content script (handles auto convert)
 * @async
 * @returns On error
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
            js: [
                {file: 'lib/mark.min.js'},
                {file: 'scripts/convert.js'},
                {file: 'scripts/content_script.js'}
            ],
            runAt: 'document_end',
            allFrames: true
        });
    }
}

// Handles changes to storage API
function handleStorageChange(changes, area) {
    // Triggers enable/disable of auto convert
    if ((typeof changes.allowAuto != 'undefined') || (typeof changes.allowAutoAdvanced != 'undefined')) {
        updateContentScript();
    }
}

/**
 * Undo the conversion
 * @async
 * @param {Object} info
 * @param {Object} tab
 */
async function undoConversion(info, tab) {
    await browser.tabs.executeScript(tab.id, {
        file: '/scripts/undo.js'
    });
    await browser.tabs.executeScript(tab.id, {
        code: `undo(${info.targetElementId});`
    });
}

/**
 * Update the undo context menu item
 * @async
 * @param {Object} info
 * @param {Object} tab
 */
async function updateUndoContextMenuItem(info, tab) {
    await browser.tabs.executeScript(tab.id, {
        file: '/scripts/undo.js'
    });
    const enable = await browser.tabs.executeScript(tab.id, {
        code: `canUndo(${info.targetElementId});`
    });
    await browser.menus.update('undo-conversion', {
        visible: enable[0]
    });
    browser.menus.refresh();
}

/**
 * Hide the undo context menu item
 */
async function hideUndoContextMenuItem() {
    await browser.menus.update('undo-conversion', {
        visible: false
    });
    browser.menus.refresh();
}

/**
 * Handle context menu updates
 * @param {Object} info
 * @param {Object} tab
 */
function updateContextMenu(info, tab) {
    if (!info.contexts.includes('selection')) {
        updateUndoContextMenuItem(info, tab);
    }
}