import fs from "fs";

const getOffsets = (index, gridWidth) => [
  index - gridWidth, // up
  index + 1, // right
  index + gridWidth, // down
  index - 1, // left
];

/*------------------------------------*/

let data = fs.readFileSync("./input.txt", "utf-8");
const gridWidth = data.indexOf("\r");

data = data
  .replace(/[\n\r]/g, "")
  .split("")
  .map((x) => ({ type: x, links: [], traced: false }));

const startIndex = data.findIndex((cell) => cell.type === "S");
let currIndex = startIndex;
let itemCount = 0;

do {
  const offsets = getOffsets(currIndex, gridWidth);

  switch (data[currIndex].type) {
    case "-": {
      data[currIndex].links.push(offsets[1]);
      data[currIndex].links.push(offsets[3]);
      break;
    }
    case "7": {
      data[currIndex].links.push(offsets[3]);
      data[currIndex].links.push(offsets[2]);
      break;
    }
    case "|": {
      data[currIndex].links.push(offsets[0]);
      data[currIndex].links.push(offsets[2]);
      break;
    }
    case "J": {
      data[currIndex].links.push(offsets[0]);
      data[currIndex].links.push(offsets[3]);
      break;
    }
    case "L": {
      data[currIndex].links.push(offsets[0]);
      data[currIndex].links.push(offsets[1]);
      break;
    }
    case "F": {
      data[currIndex].links.push(offsets[1]);
      data[currIndex].links.push(offsets[2]);
      break;
    }
    case "S": {
      for (const offsetIndex in offsets) {
        const offset = offsets[offsetIndex];

        if (!data[offset]) {
          continue;
        }

        if (offsetIndex == 0 && ["L", "J", "-"].includes(data[offset].type)) {
          continue;
        }

        if (offsetIndex === 1 && ["L", "F", "|"].includes(data[offset].type)) {
          continue;
        }

        if (offsetIndex == 2 && ["F", "7", "-"].includes(data[offset].type)) {
          continue;
        }

        if (offsetIndex == 3 && ["J", "7", "|"].includes(data[offset].type)) {
          continue;
        }

        if (data[offset].type !== ".") {
          data[currIndex].links.push(offset);
        }
      }
      break;
    }
  }

  for (const linkIndex of data[currIndex].links) {
    // bodge item count check to not get trapped at start
    if (
      !data[linkIndex].links.length ||
      (linkIndex === startIndex && itemCount > 1)
    ) {
      currIndex = linkIndex;
      itemCount++;
      break; // this only works if pipe is continuous single line
    }
  }
} while (currIndex !== startIndex);

console.log(itemCount / 2);
