import fs from "fs";

// Probably not efficient but had this at hand from 2022
const rotate = (grid, direction = "right") => {
  const matrix = [...grid.map((x) => x.slice())];

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

/*------------------------------------*/

let plate = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((x) => x.split(""));

plate = rotate(plate, "left");

let tally = 0;

for (const row of plate) {
  const newRow = [...row];
  let stopIndex = 0;

  for (const index in row) {
    const item = row[index];
    switch (item) {
      case "O":
        let newPosition = newRow.slice(stopIndex, +index + 1).indexOf(".");
        if (newPosition === -1) {
          continue;
        }
        newPosition += stopIndex;

        if (newPosition !== -1 && newPosition !== +index) {
          newRow[newPosition] = "O";
          newRow[index] = ".";
        }
        break;
      case "#":
        stopIndex = +index;
        break;
    }
  }

  for (const index in newRow) {
    if (newRow[index] === "O") {
      tally += newRow.length - index;
    }
  }
}

console.log(tally);
