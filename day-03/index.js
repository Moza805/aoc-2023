import fs from 'fs';

const getCompleteNumber = (row, x) => {
    const completeNumber = [(row[x])]
    let start = 0
    let end = row.length

    let ptr = x - 1
    while (ptr > -1) {
        if (!isNaN(row[ptr])) {
            completeNumber.unshift((row[ptr]))
            ptr--
            continue
        }
        start = ptr + 1
        break;
    }

    ptr = x + 1;
    while (ptr < row.length) {
        if (!isNaN(row[ptr])) {
            completeNumber.push((row[ptr]))
            ptr++
            continue
        }
        end = ptr - 1
        break
    }

    return [completeNumber.join(''), start, end]
}

const isSymbol = (char) => !!char && isNaN(char) && char !== '.'

const schemaRows = fs.readFileSync('./input.txt', 'utf-8').split(/\r?\n/);

const partNumbers = []

for (let y = 0; y < schemaRows.length; y++) {
    for (let x = 0; x < schemaRows[y].length; x++) {
        const candidate = schemaRows[y][x]

        if (!isNaN(candidate)) {
            const [value, startX, endX] = getCompleteNumber(schemaRows[y], x)

            let searchX = startX - 1

            let isPartNumber = false;

            // search top
            while (searchX <= endX + 1) {
                const searchCandidate = schemaRows[y - 1]?.[searchX]
                if (isSymbol(searchCandidate)) {
                    isPartNumber = true
                    break;
                }
                searchX++
            }

            // search start
            if (!isPartNumber && isSymbol(schemaRows[y][startX - 1])) {
                isPartNumber = true
            }

            // search end
            if (!isPartNumber && isSymbol(schemaRows[y][endX + 1])) {
                isPartNumber = true
            }

            // search bottom
            if (!isPartNumber) {
                searchX = startX - 1

                while (searchX <= endX + 1) {
                    const searchCandidate = schemaRows[y + 1]?.[searchX]
                    if (isSymbol(searchCandidate)) {
                        isPartNumber = true
                        break;
                    }
                    searchX++
                }
            }

            if (isPartNumber) {
                partNumbers.push(value)
            }

            x = endX
        }
    }
}

console.log('Part 1:', partNumbers.reduce((aggregate, partNumber) => aggregate += +partNumber, 0))

let sum = 0

for (let y = 0; y < schemaRows.length; y++) {
    for (let x = 0; x < schemaRows[y].length; x++) {
        const candidate = schemaRows[y][x]

        if (candidate === '*') {
            const gears = []

            let searchX = x - 1
            let endX = x + 1

            let searchY = y - 1
            let endY = y + 1

            while (searchY <= endY) {
                while (searchX <= endX) {
                    const searchCandidate = schemaRows[searchY]?.[searchX]
                    if (!isNaN(searchCandidate)) {
                        const [value, _, searchCandidateEndX] = getCompleteNumber(schemaRows[searchY], searchX)
                        gears.push(value)
                        searchX = searchCandidateEndX
                    }
                    searchX++
                }
                searchY++
                searchX = x - 1
            }

            if (gears.length === 2) {
                sum += (+gears[0] * +gears[1])
            }
        }
    }
}

console.log(sum)