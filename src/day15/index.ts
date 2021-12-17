import run from "aocrunner";
import { AStarFinder } from "astar-typescript";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
    .replace(/[^0-9 ]/g, "")
    .split("");
  const lineLength = rawInput.split("\n")[0].length;

  const weights: number[][] = new Array(lineLength).fill([]).map(() => []);

  for (const [i, char] of input.entries()) {
    const x = i % lineLength;
    const y = Math.floor(i / lineLength);

    weights[y][x] = Number(char);
  }

  return findPath(weights);
};

const part2 = (rawInput: string) => {
  const largerTimes = 5;
  const input = parseInput(rawInput)
    .replace(/[^0-9 ]/g, "")
    .split("");
  const lineLength = rawInput.split("\n")[0].length;
  const maxRisk = 9;

  const weights: number[][] = new Array(lineLength * largerTimes)
    .fill([])
    .map(() => []);

  for (const [i, char] of input.entries()) {
    for (let j = 0; j < largerTimes; j++) {
      const x = (i % lineLength) + lineLength * j;

      for (let k = 0; k < largerTimes; k++) {
        const y = Math.floor(i / lineLength) + lineLength * k;

        const weight = Number(char) + j + k;
        weights[y][x] = weight > maxRisk ? weight % maxRisk : weight;
      }
    }
  }

  return findPath(weights);
};

function findPath(weights: number[][]): number {
  const aStar: AStarFinder = new AStarFinder({
    grid: {
      matrix: weights,
    },
    diagonalAllowed: false,
    heuristic: "Manhattan",
    costAwareness: true,
    weight: 0.1,
  });

  const startC = 0;
  const lineLength = weights[0].length;
  const myPathway = aStar.findPath(
    { x: startC, y: startC },
    { x: lineLength - 1, y: lineLength - 1 },
  );

  let totalWeight = 0;
  for (const [x, y] of myPathway) {
    if (!(x == startC && y == startC)) {
      totalWeight += weights[y][x];
    }
  }

  return totalWeight;
}

run({
  part1: {
    tests: [
      {
        input: `
        1163751742
        1381373672
        2136511328
        3694931569
        7463417111
        1319128137
        1359912421
        3125421639
        1293138521
        2311944581`,
        expected: 40,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        1163751742
        1381373672
        2136511328
        3694931569
        7463417111
        1319128137
        1359912421
        3125421639
        1293138521
        2311944581`,
        expected: 315,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
