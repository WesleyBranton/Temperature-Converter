/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Creates context menu item
browser.menus.create({
	id: "convert-temp",
	title: "Convert selected temperature",
	contexts: ["selection"]
});

// Runs the converting script
async function convertTemp(tabId) {
	await browser.tabs.executeScript({
		file: "/scripts/convert.js"
	});
	await browser.tabs.executeScript({
		file: "/scripts/context_script.js"
	});
}

// Runs the function to access the converting script with the context menu item is selected
browser.menus.onClicked.addListener(function(info, tab) {
	switch (info.menuItemId) {
		case "convert-temp":
		convertTemp(tab.id);
		break;
	}
});

var ratecode = id => openRating(id);
var contentScript = null;

// Displays error notification
function listenMessage(message) {
	browser.notifications.onClicked.removeListener(ratecode);
	if (message.type == "error") {
		// Notifications for error messages
		browser.notifications.create({
			"type": "basic",
			"iconUrl": browser.runtime.getURL("icons/error-64.png"),
			"title": "Error converting temperature!",
			"message": message.error
		});
	} else if (message.type == "warning") {
		// Notifications for error messages
		browser.notifications.create({
			"type": "basic",
			"iconUrl": browser.runtime.getURL("icons/warning-64.png"),
			"title": "Error converting temperature!",
			"message": message.error
		});
	} else if (message.type == "rate") {
		// Notifications for rating reminder
		browser.notifications.create({
			"type": "basic",
			"iconUrl": browser.runtime.getURL("icons/rating-64.png"),
			"title": "Have you rated this add-on yet?",
			"message": message.text
		});
		browser.notifications.onClicked.addListener(ratecode);
	}
}

// Opens rating page
function openRating(id) {
	browser.windows.create({
		url: "https://addons.mozilla.org/en-US/firefox/addon/temperature-converter-tool/reviews/"
	});
	browser.storage.local.set({usageData: {times: "1", show: "0"}});
}

// Handles install/update
function handleInstalled(details) {
	if (details.reason == 'install') {
		browser.tabs.create({url:"messages/new.html"});
	} else if (details.reason == 'update') {
		browser.tabs.create({url:"messages/update.html"});
	}
}

// Enables/disables content script (handles auto convert)
async function updateContentScript() {
	// Removes existing content script (if necessary)
	if (contentScript) {
		contentScript.unregister();
	}
	
	// Load "auto convert" setting
	let data = await browser.storage.local.get("allowAuto");
	
	// Sets default value if "auto convert" is not set
	if (typeof data.allowAuto == "undefined") {
		browser.storage.local.set({
			allowAuto: true
		});
		return;
	}
	
	// Enables auto convert (if requried)
	if (data.allowAuto) {
		contentScript = await browser.contentScripts.register({
			matches: ["<all_urls>"],
			js: [
				{file: "scripts/mark.min.js"},
				{file: "scripts/convert.js"},
				{file: "scripts/content_script.js"}
			],
			runAt: "document_end",
			allFrames: true
		});
	}
}

// Handles changes to storage API
function handleStorageChange(changes, area) {
	// Triggers enable/disable of auto convert
	if (typeof changes.allowAuto != "undefined") {
		updateContentScript();
	}
}

// Listens of an error
updateContentScript();
browser.runtime.onMessage.addListener(listenMessage);
browser.runtime.onInstalled.addListener(handleInstalled);
browser.storage.onChanged.addListener(handleStorageChange);