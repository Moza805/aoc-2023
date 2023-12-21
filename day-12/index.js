import fs from "fs";
const matches = (springs, checks, rowId) => {
  const unknown = springs.indexOf("?");

  if (unknown > -1) {
    const goodBranch = matches(springs.replace("?", "."), checks, rowId);
    const badBranch = matches(springs.replace("?", "#"), checks, rowId);

    return goodBranch + badBranch;
  } else {
    const valid = validateRow(springs, checks);
    if (valid > 0) {
      console.log(rowId, springs);
    }

    return valid;
  }
};

const validateRow = (springs, checks, startAt = 0) => {
  const remainingSprings = springs.slice(startAt);

  // More data in the row but no more checksums
  if (!checks.length) {
    return remainingSprings.includes("#") ? 0 : 1;
  }

  // More checksums for the row but no more data
  if (!!checks.length && !remainingSprings.includes("#")) {
    return 0;
  }

  const springdex = springs.slice(startAt).indexOf("#") + startAt;
  const check = checks[0];

  const before = springs[springdex - 1];
  const range = springs.slice(springdex, springdex + check).split("");
  const after = springs[springdex + check];

  if (
    [".", undefined].includes(before) &&
    [".", undefined].includes(after) &&
    range.length === check &&
    range.every((x) => x === "#")
  ) {
    return validateRow(springs, checks.slice(1), springdex + check);
  }

  return 0;
};

/*------------------------------------*/

let count = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((row, rowId) => {
    let [springs, checks] = row.split(" ");
    checks = checks.split(",").map((d) => +d);
    return matches(springs, checks, rowId);
  })
  .reduce((agg, item) => (agg += item), 0);

console.log(count);
