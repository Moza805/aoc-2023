import fs from 'fs';

const calibrationLines = fs.readFileSync('./input.txt', 'utf-8').split(/\r?\n/);
let sum = 0;

for (const calibrationLine of calibrationLines) {
    const digits = calibrationLine.match(/\d/g);

    if(!digits?.length) {
        continue;
    }

    const lineValue = +`${digits[0]}${digits[digits.length - 1]}`

    sum += lineValue
}

console.log('Part 1:', sum)

const threeChar = [['one', 1], ['two', 2], ['six', 6]]
const fourChar = [['four', 4], ['five', 5], ['nine', 9]]
const fiveChar = [['three', 3], ['seven', 7], ['eight', 8]]
const numericTokens = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

const stringToValue = (line, index, searchValues) => {
    const length = searchValues[0][0].length

    if (line.length - index < length) {
        return undefined
    }

    const part = line.substring(index, index + length)

    for (const searchValue of searchValues) {
        const [search, value] = searchValue
        if (part === search) {
            return value
        }
    }
}

const parseLineToCalibrationValue = (line) => {
    let digits = []

    for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (numericTokens.includes(char)) {
            digits.push(+char)
            continue
        }

        // three char strings (one, two, six)
        digits = [...digits, stringToValue(line, i, threeChar)]

        // four char strings (four, five, nine)
        digits = [...digits, stringToValue(line, i, fourChar)]

        // five char strings(three, seven, eight)
        digits = [...digits, stringToValue(line, i, fiveChar)]
    }

    digits = digits.filter(x => x !== undefined)

    return +`${digits[0]}${digits[digits.length - 1]}`
}

sum = 0

for (const calibrationLine of calibrationLines) {
    sum += parseLineToCalibrationValue(calibrationLine)
}

console.log('Part 2:', sum)