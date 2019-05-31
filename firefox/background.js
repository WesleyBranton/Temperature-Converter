/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Creates context menu item
chrome.contextMenus.create({
	id: "convert-temp",
	title: "Convert selected temperature",
	contexts: ["selection"]
});

// Runs the converting script
function convertTemp(tabId) {
	chrome.tabs.executeScript({
		file: "/scripts/context_script.js"
	});
}

// Runs the function to access the converting script with the context menu item is selected
chrome.contextMenus.onClicked.addListener(function(info, tab) {
	switch (info.menuItemId) {
		case "convert-temp":
		convertTemp(tab.id);
		break;
	}
});

var ratecode = id => openRating(id);

// Displays error notification
function listenMessage(message) {
	chrome.notifications.onClicked.removeListener(ratecode);
	if (message.type == "error") {
		// Notifications for error messages
		chrome.notifications.create({
			"type": "basic",
			"iconUrl": chrome.extension.getURL("icons/error-64.png"),
			"title": "Error converting temperature!",
			"message": message.error
		});
	} else if (message.type == "warning") {
		// Notifications for error messages
		chrome.notifications.create({
			"type": "basic",
			"iconUrl": chrome.extension.getURL("icons/warning-64.png"),
			"title": "Error converting temperature!",
			"message": message.error
		});
	} else if (message.type == "rate") {
		// Notifications for rating reminder
		chrome.notifications.create({
			"type": "basic",
			"iconUrl": chrome.extension.getURL("icons/rating-64.png"),
			"title": "Have you rated this add-on yet?",
			"message": message.text
		});
		chrome.notifications.onClicked.addListener(ratecode);
	}
}

// Opens rating page
function openRating(id) {
	chrome.windows.create({
		url: "https://addons.mozilla.org/en-US/firefox/addon/temperature-converter-tool/reviews/"
	});
	chrome.storage.local.set({usageData: {times: "1", show: "0"}});
}

// Handles install/update
function handleInstalled(details) {
	if (details.reason == 'install') {
		browser.tabs.create({url:"messages/new.html"});
	} else if (details.reason == 'update') {
		browser.tabs.create({url:"messages/update.html"});
	}
}

// Listens of an error
chrome.runtime.onMessage.addListener(listenMessage);
browser.runtime.onInstalled.addListener(handleInstalled);