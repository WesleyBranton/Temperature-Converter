/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const UNITS = ['f', 'F', 'c', 'C'];
const UNIT_MARKER = ['°', '° ', ' °', ' ° ', ' ', ''];
const CHARACTERS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','o','p','q','r','s','t','u','v','w','x','y','z'];
const SYMBOLS = ['.',',','?','!','&',')','(', '_'];

/**
 * Wrapper for temperature conversion function
 * @param {String} input
 * @returns Conversion
 */
function testConvert(input) {
    return convert(input);
}

/**
 * Run tests on pre-defined sets
 * @param {String|number} number
 * @param {String} expected
 * @param {boolean} celcius
 */
function bulkTests(number, expected, celcius) {
    const start = (celcius) ? 2 : 0;
    const end = (celcius) ? 3 : 1;
    for (let u = start; u <= end; u++) {
        for (const um of UNIT_MARKER) {
            const MAIN_STRING = number + um + UNITS[u];

            // Regular
            runTest(
                testConvert,
                MAIN_STRING,
                (expected != null) ? `${MAIN_STRING} (${expected})` : null
            );

            // Leading space
            runTest(
                testConvert,
                ' ' + MAIN_STRING,
                (expected != null) ? ` ${MAIN_STRING} (${expected})` : null
            );

            // Trailing space
            runTest(
                testConvert,
                MAIN_STRING + ' ',
                (expected != null) ? `${MAIN_STRING}  (${expected})` : null
            );

            // Trailing character
            for (const c of CHARACTERS) {
                runTest(
                    testConvert,
                    MAIN_STRING + c,
                    null
                );
            }

            // Trailing character with space
            for (const c of CHARACTERS) {
                runTest(
                    testConvert,
                    MAIN_STRING + ' ' + c,
                    null
                );
            }

            // Leading character
            for (const c of CHARACTERS) {
                runTest(
                    testConvert,
                    c + MAIN_STRING,
                    null
                );
            }

            // Leading character with space
            for (const c of CHARACTERS) {
                runTest(
                    testConvert,
                    c + ' ' + MAIN_STRING,
                    null
                );
            }

            // Trailing symbol
            for (const s of SYMBOLS) {
                runTest(
                    testConvert,
                    MAIN_STRING + s,
                    null
                );
            }

            // Trailing symbol with space
            for (const s of SYMBOLS) {
                runTest(
                    testConvert,
                    MAIN_STRING + ' ' + s,
                    null
                );
            }

            // Leading symbol
            for (const s of SYMBOLS) {
                runTest(
                    testConvert,
                    s + MAIN_STRING,
                    null
                );
            }

            // Leading symbol with space
            for (const s of SYMBOLS) {
                runTest(
                    testConvert,
                    s + ' ' + MAIN_STRING,
                    null
                );
            }
        }
    }
}

bulkTests(32, '0°C', false);
bulkTests(1508, '820°C', false);
bulkTests('1,508', '820°C', false);
bulkTests('-4', '-20°C', false);
bulkTests('-1768', '-1,000°C', false);
bulkTests('-1,768', '-1,000°C', false);

bulkTests(0, '32°F', true);
bulkTests(1000, '1,832°F', true);
bulkTests('1,000', '1,832°F', true);
bulkTests('-20', '-4°F', true);
bulkTests('-1000', '-1,768°F', true);
bulkTests('-1,000', '-1,768°F', true);

bulkTests('3,,2', null, false);
bulkTests('3 2', null, false);
bulkTests('3a2', null, false);
bulkTests('3c2', null, false);