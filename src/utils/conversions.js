/**
 * Converts an array of string patterns into an array of RegExp objects.
 *
 * @param {string[]} patterns - Array of string patterns.
 * @returns {RegExp[]} - Array of RegExp objects.
 */
function convertToRegex(patterns) {
    console.debug(`Converting patterns to regex: ${patterns}`);
    const result = patterns.map((pattern) => new RegExp(pattern));
    console.debug(`Converted patterns to regex: ${result}`);
    return result;
}

module.exports = { convertToRegex };
