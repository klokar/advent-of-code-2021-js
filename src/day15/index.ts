import run from "aocrunner";
import { AStarFinder } from "astar-typescript";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
    .replace(/[^0-9 ]/g, "")
    .split("");
  const lineLength = rawInput.split("\n")[0].length;

  let weights: number[][] = new Array(lineLength).fill([]).map(() => []);

  for (let [i, char] of input.entries()) {
    let x = i % lineLength;
    let y = Math.floor(i / lineLength);

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

  let weights: number[][] = new Array(lineLength * largerTimes)
    .fill([])
    .map(() => []);

  for (let [i, char] of input.entries()) {
    for (let j = 0; j < largerTimes; j++) {
      let x = (i % lineLength) + lineLength * j;

      for (let k = 0; k < largerTimes; k++) {
        let y = Math.floor(i / lineLength) + lineLength * k;

        let weight = Number(char) + j + k;
        weights[y][x] = weight > maxRisk ? weight % maxRisk : weight;
      }
    }
  }

  return findPath(weights);
};

function findPath(weights: number[][]): number {
  let aStar: AStarFinder = new AStarFinder({
    grid: {
      matrix: weights,
    },
    diagonalAllowed: false,
    heuristic: "Manhattan",
    costAwareness: true,
    weight: 0.1,
  });

  let startC = 0;
  let lineLength = weights[0].length;
  let myPathway = aStar.findPath(
    { x: 0, y: 0 },
    { x: lineLength - 1, y: lineLength - 1 },
  );

  let totalWeight = 0;
  for (let [x, y] of myPathway) {
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
        input: `1163751742\n1381373672\n2136511328\n3694931569\n7463417111\n1319128137\n1359912421\n3125421639\n1293138521\n2311944581`,
        expected: 40,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1163751742\n1381373672\n2136511328\n3694931569\n7463417111\n1319128137\n1359912421\n3125421639\n1293138521\n2311944581`,
        expected: 315,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});