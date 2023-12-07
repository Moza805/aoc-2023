import fs from "fs";

const rounds = fs.readFileSync("./input.txt", "utf-8").split(/\r?\n/);
const normalHand = { A: 14, K: 13, Q: 12, J: 11, T: 10 };
const jokerHand = { ...normalHand, J: 1 };

const getNormalHandType = (sizes) => {
  if (sizes.length === 1) {
    return { label: "5-kind", value: 7 };
  } else if (sizes.length === 2 && sizes[0][1] === 4) {
    return { label: "4-kind", value: 6 };
  } else if (sizes.length === 2 && sizes[0][1] === 3 && sizes[1][1] === 2) {
    return { label: "full-house", value: 5 };
  } else if (sizes.length === 3 && sizes[0][1] === 3) {
    return { label: "3-kind", value: 4 };
  } else if (sizes.length === 3) {
    return { label: "2-pair", value: 3 };
  } else if (sizes.length === 4) {
    return { label: "1-pair", value: 2 };
  } else {
    return { label: "high-card", value: 1 };
  }
};

const getJokerHandType = (sizes) => {
  const noJokers = sizes.filter((x) => x[0] !== "1");

  if (!noJokers.length) {
    noJokers[0] = [14, 5]; // JJJJJ is a hand apparently
  } else {
    noJokers[0][1] += sizes.find((x) => x[0] === "1")[1];
  }

  return getNormalHandType(noJokers);
};

const parseHand = (hand, useJoker) =>
  hand
    .split("")
    .map((card) => (useJoker ? jokerHand[card] : normalHand[card]) ?? card);

const sortByTypeAndCard = (a, b) => {
  let primary = a.type.value - b.type.value;

  if (primary !== 0) {
    return primary;
  }

  for (const cardIndex in a.parsed) {
    const cA = a.parsed[cardIndex];
    const cB = b.parsed[cardIndex];

    let secondary = cA - cB;
    if (secondary !== 0) {
      return secondary;
    }
  }

  return 0;
};

const getSizes = (parsed) =>
  Object.entries(
    parsed.reduce((aggregate, card) => {
      !!aggregate[card] ? (aggregate[card] += 1) : (aggregate[card] = 1);

      return aggregate;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

const p0 = performance.now();

let p1Hands = rounds
  .map((round) => {
    let [hand, bid] = round.split(" ");
    bid = +bid;

    let parsed = parseHand(hand, false);

    const sizes = getSizes(parsed);

    let type = getNormalHandType(sizes);

    return { hand, parsed, bid, sizes, type };
  })
  .sort(sortByTypeAndCard)
  .reduce((aggregate, hand, index) => (aggregate += hand.bid * (index + 1)), 0);

const p1 = performance.now();

let p2Hands = rounds
  .map((round) => {
    let [hand, bid] = round.split(" ");
    bid = +bid;

    let parsed = parseHand(hand, true);

    const sizes = getSizes(parsed);

    let type = hand.includes("J")
      ? getJokerHandType(sizes)
      : getNormalHandType(sizes);

    return { hand, parsed, bid, sizes, type };
  })
  .sort(sortByTypeAndCard)
  .reduce((aggregate, hand, index) => (aggregate += hand.bid * (index + 1)), 0);

const p2 = performance.now();

console.log(`Part 1: ${p1Hands} (${p1 - p0}ms)`);
console.log(`Part 2: ${p2Hands} (${p2 - p1}ms)`);
