const { matrixDiff } = require("../src/matrixDiff")

describe('matrixDiff', () => {
    test('3x3 matrix', () => {
        const matrix = [
            [1, 2, 0],
            [4, 5, 6],
            [7, 8, 9]
        ];
        const expectedOutput = 3;
        expect(matrixDiff(matrix)).toBe(expectedOutput);
    });

    test('4x4 matrix', () => {
        const matrix = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16]
        ];
        const expectedOutput = 0;
        expect(matrixDiff(matrix)).toBe(expectedOutput);
    });

    test('2x2 matrix', () => {
        const matrix = [
            [1, 2],
            [3, 4]
        ];
        const expectedOutput = 0;
        expect(matrixDiff(matrix)).toBe(expectedOutput);
    });

    test('1x1 matrix', () => {
        const matrix = [
            [5]
        ];
        const expectedOutput = 0;
        expect(matrixDiff(matrix)).toBe(expectedOutput);
    });
});