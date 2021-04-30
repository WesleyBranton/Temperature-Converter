/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Pulls number from user selection
 * @param {String} text
 * @returns Number
 */
function getNumber(text) {
    let charPos = 0;
    let result = {
        temperature : '',
        decimalPlaces : 0
    };
    let negative = false;
    let loop = true;
    let currentCharacter;
    let hasDecimal = false;
    
    do { // Cycles through characters to determine if they are valid numbers
        currentCharacter = text.charAt(charPos);

        switch(currentCharacter) {
            case ' ':
            case ',': // Character is a space or a digit group separator
                charPos++;
                break;
            case '-':
                if (result.temperature.length == 0 && !negative) { // If first character is a valid negative
                    negative = true;
                    charPos++;
                } else { // If number contains an invalid negative
                    loop = false;
                    result.temperature = '';
                }
                break;
            case '.':
                if (!hasDecimal && !negative && result.temperature.length > 0) { // If number contains a valid decimal
                    result.temperature += currentCharacter;
                    hasDecimal = true;
                    charPos++;
                } else { // If number contains two decimals
                    loop = false;
                    result.temperature = '';
                }
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9': // If character is a number
                result.temperature += currentCharacter;
                charPos++;
                break;
            default:
                loop = false;
        }
    } while (loop);
    
    if (hasDecimal == true) { // Counts number of decimal places in the original selection
        let detected = false;
        let numOfDec = 0;

        do {
            const testChar = result.temperature.charAt(result.temperature.length - numOfDec - 1);
            if (!isNaN(parseInt(testChar))) { // If character is a number
                numOfDec++;
            } else { // If character is a decimal
                detected = true;
            }
        } while (!detected);

        result.decimalPlaces = numOfDec;
    }

    result.temperature = parseFloat(result.temperature);
    if (negative) result.temperature *= -1;

    return result;
}

/**
 * Converts temperature into the desired unit
 * @param {number} value
 * @param {String} from
 * @param {String} to
 * @returns Converted number
 */
function convertTemperature(value, from, to) {
    let converted;

    if (to == 'C') { // Fahrenheit --> Celsius
        converted = (value.temperature - 32) * (5 / 9);
    } else { // Celsius --> Fahrenheit
        converted = (value.temperature * (9 / 5)) + 32;
    }

    converted = new Intl.NumberFormat().format(converted);

    return converted;
}
