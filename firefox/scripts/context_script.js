/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Checks that temperature hasn't already been converted
function convertVerify() {
	var convertVerify = document.getElementsByClassName('firefoxtempconvertedcomplete');
	alert(convertVerify.length);
}

function userTempSelect() {
	if (window.getSelection()) {
		// Creates variables
		var temp;
		var unit;
		var errorNotification = "error-notification";
		
		// Stores user selection & stores as text string
		var selection = window.getSelection();
		var originalSelection = '' + selection;
		var unitVerify = originalSelection.toUpperCase();
		
		// Checks if user has already converted
		var convertVerify = document.getElementsByClassName('firefoxtempconvertedcomplete');
		for (var i = 0; i < convertVerify.length; i++) {
			if (selection.containsNode(convertVerify[i],true)) {
				chrome.runtime.sendMessage({"error": "The temperature you have selected has already been converted using this extension.\n\nPlease select a different temperature.","type": "warning"});
				return;
			}
		}
		
		// Checks for extra characters after user selection
		var extraCharVerification = true;
		var verificationStep = 1;
		do {
			var verificationCharacter = unitVerify.length - verificationStep;
			lastChar = unitVerify.charAt(verificationCharacter)
			if (lastChar == ' ') {
				// If characters after temperature selection are spaces
				verificationStep = verificationStep + 1;
			} else if (lastChar == 'F' || lastChar == 'C') {
				// If there are no extra characters after the selection
				extraCharVerification = false;
			} else {
				// If there are extra characters after selection
				extraCharVerification = false;
				chrome.runtime.sendMessage({"error": "The temperature you have selected is invalid.\n\nPlease select a different temperature.","type": "error"});
				return;
			}
		} while (extraCharVerification == true);
		
		if (selection.rangeCount > 0) {
			if (unitVerify.search('F') > -1) {
				// If temperature is fahrenheit
				unit = '\u00B0' + 'C';
				unitVerify = getNumber(unitVerify);
				temp = ftoc(unitVerify);
			} else if (unitVerify.search('C') > -1) {
				// If temperature is celsius
				unit = '\u00B0' + 'F';
				unitVerify = getNumber(unitVerify);
				temp = ctof(unitVerify);
			} else {
				// If temperature is not valid
				chrome.runtime.sendMessage({"error": "The temperature you have selected is invalid.\n\nPlease select a different temperature.","type": "error"});
				return;
			}
			// Outputs converted temperature
			var range = selection.getRangeAt(0);
			var output = document.createElement('span');
			output.className = 'firefoxtempconvertedcomplete';
			output.appendChild(document.createTextNode(originalSelection + ' (' + temp + unit + ') '));
			range.deleteContents();
			range.insertNode(output);
			window.getSelection().removeAllRanges();
			
			// Usage data count
			chrome.storage.local.get("usageData", gotItem);
		}
	}
}

// Usage data counter
function gotItem(item) {
	if (item.usageData) {
		// If there is already data setup
		var showNote = parseInt(item.usageData.show);
		if (showNote == 1) {
			// If the user has not already clicked to rate the add-on
			var current = parseInt(item.usageData.times);
			current = current + 1;
			current = '' + current;
			chrome.storage.local.set({usageData: {times: current, show: "1"}});
			if (parseInt(current) % 50 == 0) {
				// If the user needs to be reminded to rate the add-on
				chrome.runtime.sendMessage({"type": "rate","text": "Are you liking this add-on? Please tell Firefox users how great this add-on is!\n\nClick this notification to open the Firefox add-on listing in a new window."});
			}
		}
	} else {
		// If there is no data setup
		chrome.storage.local.set({usageData: {times: "1", show: "1"}});
	}
}

// Starts conversion function
userTempSelect();