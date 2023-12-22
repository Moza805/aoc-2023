import fs from "fs";

const getHalves = (row, index) => {
  const left = row.substring(0, index).split("").reverse().join("");
  const right = row.substring(index, index + left.length);

  return [left, right];
};

const summarize = (agg, curr) => agg.filter((a) => curr.includes(a));

const findReflections = (row) => {
  const reflections = [];

  for (let i = 0; i < Math.ceil(row.length / 2); i++) {
    const [l2rLeft, l2rRight] = getHalves(row, i);
    const [r2lLeft, r2lRight] = getHalves(row.split("").reverse().join(""), i);

    if (l2rLeft === l2rRight && !!l2rLeft.length) {
      reflections.push(i);
    }
    if (r2lLeft === r2lRight && !!r2lLeft.length) {
      reflections.push(row.length - i);
    }
  }
  return reflections;
};

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
  .reduce(
    (agg, curr) => {
      if (!curr.length) {
        agg.push([]);
        return agg;
      }

      agg[agg.length - 1].push(curr);
      return agg;
    },
    [[]]
  )
  .map((pattern) => {
    let reflections = pattern.map(findReflections);
    reflections = reflections.reduce(summarize);

    if (reflections.length === 1) {
      return { point: reflections[0], dir: "row" };
    }

    pattern = rotate(
      pattern.map((row) => row.split("")),
      "left"
    ).map((row) => row.join(""));

    reflections = pattern.map(findReflections);
    reflections = reflections.reduce(summarize);

    if (reflections.length > 1) {
      throw new Error("Multiple reflections");
    }
    return { point: reflections[0], dir: "col" };
  });

console.log(
  "Part 1:",
  patterns.reduce(
    (agg, curr) =>
      curr.dir === "row" ? (agg += curr.point) : (agg += curr.point * 100),
    0
  )
);
