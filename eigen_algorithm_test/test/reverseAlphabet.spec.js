const { reverseAlphabet } = require("../src/reverseAlphabet")

describe('reverseAlphabet', () => {
    test('should reverse the alphabets and keep the digits at the end', () => {
        const input = 'NEGIE1';
        const expectedOutput = 'EIGEN1';
        expect(reverseAlphabet(input)).toBe(expectedOutput);

        const input2 = 'NESSPI2';
        const expectedOutput2 = 'IPSSEN2';
        expect(reverseAlphabet(input2)).toBe(expectedOutput2);
    });
});