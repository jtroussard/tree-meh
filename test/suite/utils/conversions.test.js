const assert = require('assert');
const { convertToRegex } = require('../../../src/utils/conversions.js');

suite('convertToRegex', () => {
    test('should convert an array of strings to an array of RegExp objects', () => {
        const patterns = ['^abc', 'xyz$', '.*test.*'];
        const result = convertToRegex(patterns);
        
        assert.strictEqual(result.length, patterns.length, 'Expected the result array to have the same length as the input array');
        assert.ok(result.every((regex, index) => regex instanceof RegExp), 'Expected every element in the result to be an instance of RegExp');
        assert.strictEqual(result[0].toString(), '/^abc/', 'Expected first regex to match /^abc/');
        assert.strictEqual(result[1].toString(), '/xyz$/', 'Expected second regex to match /xyz$/');
        assert.strictEqual(result[2].toString(), '/.*test.*/', 'Expected third regex to match /.*test.*/');
    });

    test('should return an empty array when given an empty array', () => {
        const patterns = [];
        const result = convertToRegex(patterns);

        assert.strictEqual(result.length, 0, 'Expected result array to be empty');
    });

    test('should handle invalid inputs gracefully', () => {
        assert.throws(() => convertToRegex(null), 'Expected function to throw on null input');
        assert.throws(() => convertToRegex(undefined), 'Expected function to throw on undefined input');
        assert.throws(() => convertToRegex(123), 'Expected function to throw on non-array input');
    });
});
