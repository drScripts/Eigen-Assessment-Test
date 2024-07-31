/**
 * count the same on input based on query
 * @param {string[]} input - input words.
 * @param {string[]} query - query words.
 * @return {number[]} - array of results
 */
function arrayWordCount(input, query) {
    const result = [];

    for (let i = 0; i < query.length; i++) {
        let count = 0;
        for (let j = 0; j < input.length; j++) {
            if (query[i] === input[j]) {
                count++;
            }
        }
        result.push(count);
    }

    return result;
}

module.exports = { arrayWordCount };