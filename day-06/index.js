import fs from "fs";

const calculateSumOfWinningRaces = (times, distances) => {
  let sum = 1;

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];

    let timeHeld = 1;
    let prev = 0;
    let winners = 0;

    while (timeHeld < time) {
      let distanceMoved = timeHeld * (time - timeHeld);

      if (distanceMoved > distance) {
        winners++;
      }
      if (prev > distanceMoved && distanceMoved < distance) {
        break;
      }
      prev = distanceMoved;
      timeHeld++;
    }

    sum *= winners;
  }

  return sum;
};

const races = fs.readFileSync("./input.txt", "utf-8").split(/\r?\n/);

console.log(
  "Part 1:",
  calculateSumOfWinningRaces(
    races[0].match(/\d+/g).map((x) => +x),
    races[1].match(/\d+/g).map((x) => +x)
  )
);

console.log(
  "Part 2:",
  calculateSumOfWinningRaces(
    races[0]
      .replace(/\s/g, "")
      .match(/\d+/g)
      .map((x) => +x),
    races[1]
      .replace(/\s/g, "")
      .match(/\d+/g)
      .map((x) => +x)
  )
);
