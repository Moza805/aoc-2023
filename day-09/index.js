import fs from "fs";

const dX = (row) => {
  if (row.every((x) => x === 0)) {
    return 0;
  }
  const reduced = row.reduce(
    (aggregate, _, idx) => {
      if (idx === row.length - 1) {
        return aggregate;
      }

      const value = row[idx + 1] - row[idx];

      aggregate.values.push(value);
      aggregate.keys[value] = 1;

      return aggregate;
    },
    { keys: {}, values: [] }
  );

  return row[row.length - 1] + dX(reduced.values);
};

/*------------------------------------*/

const rows = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((x) => x.match(/-?\d+/g))
  .map((row) => row.map((x) => +x));

const p1 = rows
  .map(dX)
  .reduce((aggregate, current) => (aggregate += current), 0);

console.log("Part 1:", p1);

let p2 = rows
  .map((x) => x.reverse())
  .map(dX)
  .reduce((aggregate, current) => (aggregate += current), 0);

console.log("Part 2:", p2);
