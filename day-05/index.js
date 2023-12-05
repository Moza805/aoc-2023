import fs from "fs";

class Almanac {
  #mode = "seed-to-soil";

  constructor(fileContents) {
    this.fileContents = fileContents;
    this.seedBatches = [];
    this.orderedMaps = {
      ["seed-to-soil"]: [],
      ["soil-to-fertilizer"]: [],
      ["fertilizer-to-water"]: [],
      ["water-to-light"]: [],
      ["light-to-temperature"]: [],
      ["temperature-to-humidity"]: [],
      ["humidity-to-location"]: [],
    };
  }

  addPart1Seeds() {
    this.seedBatches = this.fileContents[0]
      .match(/\d+/g)
      .map((x) => ({ start: +x, end: +x }));
  }

  addPart2Seeds() {
    const seedNumbers = this.fileContents[0].match(/\d+/g).map((x) => +x);

    for (let i = 0; i < seedNumbers.length; i += 2) {
      const start = seedNumbers[i];
      const end = start + seedNumbers[i + 1];
      this.seedBatches.push({ start, end });
    }
  }

  addMaps() {
    for (const line of this.fileContents) {
      if (line.startsWith("seeds:")) {
        continue;
      }

      if (/^\D/.test(line)) {
        this.mode = line.split(" ")[0];
      }

      if (/^\d/.test(line)) {
        const [mOut, mIn, mRange] = line.match(/\d+/g).map((x) => +x);

        this.orderedMaps[this.mode].push({
          in: [mIn, mIn + mRange],
          out: [mOut, mOut + mRange],
          offset: mOut - mIn,
        });
      }
    }
  }

  get closestSeed() {
    let closest = Infinity;

    for (const seedBatch of this.seedBatches) {
      const length = seedBatch.end - seedBatch.start + 1;

      for (let i = 0; i < length; i++) {
        let mappedValue = seedBatch.start + i;

        for (const [mapName, mapRanges] of Object.entries(this.orderedMaps)) {
          if (this.orderedMaps.hasOwnProperty(mapName)) {
            for (const range of mapRanges) {
              if (mappedValue >= range.in[0] && mappedValue <= range.in[1]) {
                mappedValue += range.offset;
                break;
              }
            }
          }
        }

        if (mappedValue < closest) {
          closest = mappedValue;
        }
      }
    }

    return closest;
  }
}

const almanac = fs.readFileSync("./input.txt", "utf-8").split(/\r?\n/);

const p1Almanac = new Almanac(almanac);
p1Almanac.addPart1Seeds();
p1Almanac.addMaps();
console.log("Part 1: ", p1Almanac.closestSeed);

const p2Almanac = new Almanac(almanac);
p2Almanac.addPart2Seeds();
p2Almanac.addMaps();
console.log("Part 2: ", p2Almanac.closestSeed);
