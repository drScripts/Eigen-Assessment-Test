/**
 * find the longest word in one sentence
 * @param {string} sentence - the sentence to find.
 * @return {string} - result the longest word.
 */
function longestWord(sentence) {
    const words = sentence.split(' ');
    let longest = '';

    for (let i = 0; i < words.length; i++) {
        if (words[i].length > longest.length) {
            longest = words[i];
        }
    }

    return longest;
}

module.exports = { longestWord }