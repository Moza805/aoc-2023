import fs from 'fs';

const games = fs.readFileSync('./input.txt', 'utf-8').split(/\r?\n/);

const gameResults = []

const emptyColourCount = { r: 0, g: 0, b: 0 }

for (const game of games) {
    const result = { ...emptyColourCount }

    const id = game.match(/\d+/)[0]

    const subsets = game.split(':')[1].split(';')

    for (const subset of subsets) {
        const colours = subset.split(',')

        for (const colour of colours) {

            const value = +(colour.match(/\d+/)[0])

            if (colour.includes('red')) {
                if (result.r <= value) {
                    result.r = value
                }
                continue;
            }
            if (colour.includes('green')) {
                if (result.g <= value) {
                    result.g = value
                }
                continue;
            }
            if (result.b <= value) {
                result.b = value
            }
        }
    }
    gameResults.push({ id, result })
}

console.log("Part 1:", gameResults
    .filter(x =>
        x.result.r <= 12 &&
        x.result.g <= 13 &&
        x.result.b <= 14)
    .map(x => x.id)
    .reduce((aggregate, id) => aggregate += +id, 0)
)


console.log(gameResults
    .map(x => x.result.r * x.result.g * x.result.b)
    .reduce((aggregate, power) => aggregate += power, 0))