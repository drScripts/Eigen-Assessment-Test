/**
 * main logic
 * [`1`, 2, `0`],
 * [4, `5`, 6],
 * [`7`, 8, `9`]
 * 
 * calculate based on number that have been marked by "`" 
 * 
 * calculate diff between sum of diagonal matrix
 * @param {number[][]} matrix - The NxN matrix.
 * @return {number} - diff results.
 * 
 * 
 * if non NxN should be count on difference loop for
 */
function matrixDiff(matrix) {
    let primaryDiag = 0;
    let secondDiag = 0;
    const n = matrix.length;

    for (let i = 0; i < n; i++) {
        primaryDiag += matrix[i][i];
        secondDiag += matrix[i][n - i - 1];
    }

    return Math.abs(primaryDiag - secondDiag);
}

module.exports = { matrixDiff }