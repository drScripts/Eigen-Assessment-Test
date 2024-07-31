const { arrayWordCount } = require('../src/arrayWordCount');

describe('arrayWordCount', () => {
    test('should return minimum expectation', () => {
        const input = ['xc', 'dz', 'bbb', 'dz'];
        const query = ['bbb', 'ac', 'dz'];
        const expectedOutput = [1, 0, 2];
        expect(arrayWordCount(input, query)).toEqual(expectedOutput);
    });

    test('should return array 0 when no match word on query', () => {
        const input = ['xc', 'dz', 'bbb', 'dz'];
        const query = ['ac', 'ef', 'gh'];
        const expectedOutput = [0, 0, 0];
        expect(arrayWordCount(input, query)).toEqual(expectedOutput);
    });

    test('should handle an empty input array', () => {
        const input = [];
        const query = ['bbb', 'ac', 'dz'];
        const expectedOutput = [0, 0, 0];
        expect(arrayWordCount(input, query)).toEqual(expectedOutput);
    });

    test('should handle an empty query array', () => {
        const input = ['xc', 'dz', 'bbb', 'dz'];
        const query = [];
        const expectedOutput = [];
        expect(arrayWordCount(input, query)).toEqual(expectedOutput);
    });
});
