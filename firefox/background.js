/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

let contentScript = null;

updateContentScript();
browser.runtime.onMessage.addListener(manageBrowserNotifications);
browser.runtime.onInstalled.addListener(handleInstalled);
browser.storage.onChanged.addListener(handleStorageChange);

// Creates context menu item
browser.menus.create({
    id: 'convert-temp',
    title: 'Convert selected temperature',
    contexts: ['selection']
});

// Runs the function to access the converting script with the context menu item is selected
browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case 'convert-temp':
            convertTemperature(tab.id);
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

/**
 * Handles browser notifications
 * @param {Object} message 
 */
function manageBrowserNotifications(message) {
    browser.notifications.onClicked.removeListener(openRating);

    if (message.type == 'error') { // Notifications for error messages
        browser.notifications.create({
            type: 'basic',
            iconUrl: browser.runtime.getURL('icons/error-64.png'),
            title: 'Error converting temperature!',
            message: message.error
        });
    } else if (message.type == 'warning') { // Notifications for error messages
        browser.notifications.create({
            type: 'basic',
            iconUrl: browser.runtime.getURL('icons/warning-64.png'),
            title: 'Error converting temperature!',
            message: message.error
        });
    } else if (message.type == 'rate') { // Notifications for rating reminder
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