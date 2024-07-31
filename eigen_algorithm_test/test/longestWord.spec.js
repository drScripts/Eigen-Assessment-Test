const { longestWord } = require("../src/longestWord")

describe('longestWord', () => {
    test('should return the longest word in the sentence', () => {
        const sentence = 'Saya sangat senang mengerjakan soal algoritma';
        const expectedOutput = 'mengerjakan';
        expect(longestWord(sentence)).toBe(expectedOutput);
    });

    test('should return one of the longest words if multiple words have the same length', () => {
        const sentence = 'Aku suka makan nasi';
        const result = longestWord(sentence);
        expect(['makan', 'nasi']).toContain(result);
    });
});