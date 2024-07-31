/**
 * reverse alphabet characters and leave number at the end
 * 
 * @param {string} input - The input string to process.
 * @returns {string} - reversed string based on input
 */
function reverseAlphabet(input) {
    let alphabets = [];
    let digits = '';

    for (let i = 0; i < input.length; i++) {
        if (isNaN(input[i])) {
            alphabets.push(input[i]);
        } else {
            digits += input[i];
        }
    }

    return alphabets.reverse().join('') + digits;
}


module.exports = { reverseAlphabet }