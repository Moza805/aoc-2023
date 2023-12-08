import fs from "fs";

const findCommonDenominator = (a, b) =>
  b == 0 ? a : findCommonDenominator(b, a % b);

const followGhostPath = (network, startNodes, directions, finishCondition) => {
  let stepCounts = startNodes.map((node) =>
    followPath(network, node, directions, finishCondition)
  );

  let lcm = stepCounts[0].count;

  for (let i = 1; i < stepCounts.length; i++) {
    lcm =
      (lcm * stepCounts[i].count) /
      findCommonDenominator(lcm, stepCounts[i].count);
  }

  return { stepCounts, count: lcm };
};

const followPath = (network, startNode, directions, finishCondition) => {
  const directionLength = directions.length;

  let node = startNode;
  let count = 0;

  do {
    try {
      node = network[node][directions[count % directionLength]];
      count++;
    } catch (ex) {
      throw ex;
    }
  } while (!finishCondition({ node, count }));

  return { node, count };
};

/*------------------------------------*/

const map = fs.readFileSync("./input.txt", "utf-8").split(/\r?\n/);

const directions = map[0].split("");

const network = map.slice(2).reduce((aggregate, node) => {
  const [id, L, R] = node.match(/\w{3}/g);

  aggregate[id] = { L, R };

  return aggregate;
}, {});

console.log(
  "Part A:",
  followPath(network, "AAA", directions, (node) => node.node === "ZZZ").count
);

console.log(
  "Part B:",
  followGhostPath(
    network,
    Object.keys(network).filter((key) => key[2] === "A"),
    directions,
    (node) => node.node[2] === "Z"
  ).count
);
