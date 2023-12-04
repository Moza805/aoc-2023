import fs from "fs";

const cards = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((row) => {
    const [winningCards, elfCards] = row
      .split(": ")[1]
      .split("|")
      .map((cardSet) => cardSet.match(/\d+/g).map((num) => +num));

    const matches = winningCards.filter((card) =>
      elfCards.includes(card)
    ).length;

    return {
      matches,
      score: matches === 0 ? 0 : 1 << (matches - 1),
      copies: 1,
    };
  });

console.log(
  `Part 1: ${cards.reduce((aggregate, { score }) => aggregate + score, 0)}`
);

for (let i = 0; i < cards.length; i++) {
  let { matches, copies } = cards[i];

  for (let offset = 1; offset <= matches; offset++) {
    cards[i + offset].copies += copies;
  }
}

console.log(
  `Part 2: ${cards.reduce((aggregate, { copies }) => aggregate + copies, 0)}`
);
