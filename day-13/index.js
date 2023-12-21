import fs from "fs";

const findReflections = (row, rId) => {
  const reflections = []

  for (let i = 0; i < row.length; i++) {
    const l2rLeft = row.substring(0, i).split('').reverse().join('')
    const l2rRight = row.substring(i, i + l2rLeft.length)

    const r2l = row.split('').reverse().join('')


    const r2lLeft = r2l.substring(0, i).split('').reverse().join('')
    const r2lRight = r2l.substring(i, i + r2lLeft.length)

    if ((l2rLeft === l2rRight && !!l2rLeft.length)) {
      reflections.push(i)
    }
    if ((r2lLeft === r2lRight && !!r2lLeft.length)) {
      reflections.push(row.length - i - 1)
    }
  }
  return reflections
}

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

let patterns = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .reduce((agg, curr) => {
    if (!curr.length) {
      agg.push([]);
      return agg;
    }

    agg[agg.length - 1].push(curr)
    return agg;
  }, [[]])
  .map((pattern) => {
    const rowReflections = pattern.map(findReflections)
      .reduce((agg, curr) => agg.filter((a) => curr.includes(a)))

    if (rowReflections.length === 1) {
      return rowReflections[0]
    }

    let rotated = pattern.map((row) => row.split(''));
    rotated = rotate(rotated);
    rotated =rotated.map(row => row.join(''));

    const colReflections = rotated.map(findReflections)
      .reduce((agg, curr) => agg.filter((a) => curr.includes(a)))

    if (colReflections.length > 1) {
      throw new Error('Multiple reflections')
    }
    return colReflections[0]
  });

console.log(patterns);
