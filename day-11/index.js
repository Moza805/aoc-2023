import fs from "fs";

// Probably not efficient but had this at hand from 2022
const rotate = (universe, direction = "right") => {
  const matrix = [...universe.map((x) => x.slice())];

  const rotatedMatrix = new Array(
    matrix[0].map((_) => new Array(matrix.length))
  )[0];

  direction === "left" && matrix.map((x) => x.reverse());

  matrix.forEach((row, rowIdx) =>
    row.forEach((col, colIdx) => {
      rotatedMatrix[colIdx][rowIdx] = col;
    })
  );

  direction === "right" && rotatedMatrix.map((x) => x.reverse());

  return rotatedMatrix;
};

const getExpansions = (universe) => {
  let factors = [];
  for (let i = universe.length - 1; i >= 0; i--) {
    if (universe[i].every((x) => x === ".")) {
      factors.push(i);
    }
  }

  return factors;
};

const findGalaxyCoords = (universe) =>
  universe.reduce((aggregate, row, rowIdx) => {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === "#") {
        aggregate.push([rowIdx, i]);
      }
    }
    return aggregate;
  }, []);

const calculate = (universe, expansionRate) => {
  const rowExpansions = getExpansions(universe);
  const colExpansions = getExpansions(rotate(universe));

  const galaxies = findGalaxyCoords(universe);

  return galaxies
    .reduce((distances, galaxy, idx) => {
      for (let i = idx + 1; i < galaxies.length; i++) {
        const a = galaxy;
        const b = galaxies[i];

        const minRow = a[1] < b[1] ? a[1] : b[1];
        const maxRow = a[1] > b[1] ? a[1] : b[1];
        const minCol = a[0] < b[0] ? a[0] : b[0];
        const maxCol = a[0] > b[0] ? a[0] : b[0];

        const rowExpansion = rowExpansions
          .filter((x) => x >= minCol && x <= maxCol)
          .reduce((sum) => (sum += expansionRate - 1), 0);
        const colExpansion = colExpansions
          .filter((x) => x >= minRow && x <= maxRow)
          .reduce((sum) => (sum += expansionRate - 1), 0);

        const rowDiff = Math.abs(galaxy[0] - galaxies[i][0]) + rowExpansion;
        const colDiff = Math.abs(galaxy[1] - galaxies[i][1]) + colExpansion;

        distances.push(rowDiff + colDiff);
      }

      return distances;
    }, [])
    .reduce((sum, distance) => (sum += distance), 0);
};
/*------------------------------------*/

let universe = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((row) => row.split(""));

console.log("Part 1:", calculate(universe, 2));
console.log("Part 2:", calculate(universe, 1000000));
