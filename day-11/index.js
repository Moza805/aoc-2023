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

const expand = (universe) => {
  for (let i = universe.length; i >= 1; i--) {
    if (universe[i - 1].every((x) => x === ".")) {
      universe.splice(i, 0, universe[i - 1]);
    }
  }

  return universe;
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

/*------------------------------------*/

let universe = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((row) => row.split(""));

universe = expand(universe);
universe = rotate(universe);
universe = expand(universe);

const galaxies = findGalaxyCoords(universe);

const distance = galaxies
  .reduce((distances, galaxy, idx) => {
    for (let i = idx + 1; i < galaxies.length; i++) {
      const xDiff = Math.abs(galaxy[0] - galaxies[i][0]);
      const yDiff = Math.abs(galaxy[1] - galaxies[i][1]);
      distances.push(xDiff + yDiff);
    }

    return distances;
  }, [])
  .reduce((sum, distance) => (distance += sum), 0);

console.log(distance);
