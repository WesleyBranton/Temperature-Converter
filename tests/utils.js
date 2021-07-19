/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Run the test function and output the result
 * @param {Function} test
 * @param {String|number} input
 * @param {String} expected
 */
function runTest(test, input, expected) {
    const result = {
        input: input,
        expected: expected,
        actual: test(input)
    }

    const ui = (result.expected == result.actual) ? generatePass(result) : generateFail(result);
    document.body.appendChild(ui);

    ++totalCount;
    updateTotals();
}

/**
 * Generate a passed test UI entry
 * @param {Object} result
 * @returns HTML Element
 */
function generatePass(result) {
    const output = document.getElementById('template-pass').content.cloneNode(true).children[0];
    output.getElementsByClassName('title')[0].textContent = `Test: "${result.input}"`;
    ++passedCount;
    return output;
}

/**
 * Generate a failed test UI entry
 * @param {Object} result
 * @returns HTML Element
 */
function generateFail(result) {
    const output = document.getElementById('template-fail').content.cloneNode(true).children[0];
    output.getElementsByClassName('title')[0].textContent = `Test: "${result.input}"`;
    output.getElementsByClassName('expected')[0].getElementsByTagName('span')[0].textContent = result.expected;
    output.getElementsByClassName('actual')[0].getElementsByTagName('span')[0].textContent = result.actual;
    ++failedCount;
    return output;
}

/**
 * Update test counter totals
 */
function updateTotals() {
    totalUi.textContent = totalCount;
    passedUi.textContent = passedCount;
    failedUi.textContent = failedCount;
}

/**
 * Toggle the display of only failed tests or all tests
 */
function toggleFilter() {
    if (onlyFailed) {
        document.body.classList.remove('only-failed');
        filter.textContent = 'Show only failed tests';
    } else {
        document.body.classList.add('only-failed');
        filter.textContent = 'Show all tests';
    }

    onlyFailed = !onlyFailed;
}

let onlyFailed = false;
let totalCount = 0;
let passedCount = 0;
let failedCount = 0;
const totalUi = document.getElementById('total-total');
const passedUi = document.getElementById('total-passed');
const failedUi = document.getElementById('total-failed');
const filter = document.getElementById('filter');

filter.addEventListener('click', toggleFilter);
document.getElementById('refresh').addEventListener('click', () => { window.location.reload(); });