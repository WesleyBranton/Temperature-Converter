/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Pulls number from user selection
function getNumber(num) {
	// Creates temporary variables
	var charPos = 0;
	var result = {
		temperature : '',
		decimalPlaces : 0
	};
	var loop = true;
	var currentCharacter;
	var hasDecimal = false;
	
	// Cycles through characters to determine if they are valid numbers
	do {
		currentCharacter = num.charAt(charPos);
		if (currentCharacter == ' ' || currentCharacter == ',') {
			// If character is a space or a digit group separator
			charPos = charPos + 1;
		} else if (result.temperature == '' && currentCharacter == '-') {
			// If first character is a valid negative
			result.temperature = '-';
			charPos = charPos + 1;
		} else if (currentCharacter == '-') {
			// If number contains an invalid negative
			loop = false;
			result.temperature = '';
		} else if (result.temperature != '-' && result.temperature != '' && hasDecimal == false && currentCharacter == '.') {
			// If number contains a valid decimal
			result.temperature = result.temperature + currentCharacter;
			hasDecimal = true;
			charPos = charPos + 1;
		} else if ((result.temperature == '-' || result.temperature == '' || hasDecimal == true) && currentCharacter == '.') {
			// If number contains two decimals
			loop = false;
			result.temperature = '';
		} else if (currentCharacter == '1' || currentCharacter == '2' || currentCharacter == '3' || currentCharacter == '4' || currentCharacter == '5' || currentCharacter == '6' || currentCharacter == '7' || currentCharacter == '8' || currentCharacter == '9' || currentCharacter == '0') {
			// If character is a number
			result.temperature = result.temperature + currentCharacter;
			charPos = charPos + 1;
		} else if (currentCharacter == 'F' || currentCharacter == 'C' || currentCharacter === '°') {
			// If number reachs end marker
			loop = false;
		} else {
			// Other error
			loop = false;
		}
	} while (loop);
	
	// Counts number of decimal places in the original selection
	if (hasDecimal == true) {
		var resultLength = result.temperature.length;
		var detected = false;
		var numOfDec = 0;
		do {
			var testChar = result.temperature.charAt(resultLength - numOfDec - 1);
			if (testChar == '1' || testChar == '2' || testChar == '3' || testChar == '4' || testChar == '5' || testChar == '6' || testChar == '7' || testChar == '8' || testChar == '9' || testChar == '0') {
				// If character is a number
				numOfDec = numOfDec + 1;
			} else {
				// If character is a decimal
				detected = true;
			}
		} while (detected == false);
		result.decimalPlaces = numOfDec;
	}
	result.temperature = parseFloat(result.temperature);
	return result;
}

function ftoc(temp) {
	// Convert from Fahrenheit to Celsius
	var converted = (temp.temperature - 32) * (5/9);
	converted = converted.toFixed(temp.decimalPlaces);
	converted = digitSeperate(converted,temp);
	return converted;
}

function ctof(temp) {
	// Convert from Celsius to Fahrenheit
	var converted = (temp.temperature * (9/5)) + 32;
	converted = converted.toFixed(temp.decimalPlaces);
	converted = digitSeperate(converted,temp);
	return converted;
}

// Adds comma to seperate thousands
function digitSeperate(num,temp) {
	var number = '' + num;
	var decimal = temp.decimalPlaces;
	var charPos = number.length - 1;
	var charCount = 0;
	var loop = true;
	var result = '';
	// Determines if there is a decimal
	if (decimal <= 0) {
		// If there is no decimal
		var charPos = number.length - 1;
	} else {
		// If there is a decimal
		var decLoop = true;
		var charPos = number.length - 1;
		do {
			var current = number.charAt(charPos);
			if (current == '.') {
				decLoop = false;
			}
			charPos = charPos - 1;
			result = current + result;
		} while (decLoop);
	}
	// Counts characters
	do {
		var currentChar = num.charAt(charPos);
		charCount = charCount + 1;
		if (charCount >= 4) {
			// If three characters have been counted
			if (charPos > 0) {
				// If there are more characters
				result = ',' + currentChar + result;
			} else {
				// If there are no more characters
				result = currentChar + result;
			}
			charCount = 0;
			charPos = charPos - 1;
		} else {
			// If three characters have not been counted
			result = currentChar + result;
			charCount = charCount + 1;
			charPos = charPos - 1;
		}
		if (charPos < 0) {
			// If there are no more characters
			loop = false;
		}
	} while (loop);
	return result;
}