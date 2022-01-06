import run from "aocrunner";

class Heightmap {
  heights: number[];
  width: number;
  height: number;

  constructor(heights: number[], width: number, height: number) {
    this.heights = heights;
    this.width = width;
    this.height = height;
  }

  exists(i: number): boolean {
    return i in this.heights;
  }

  isOnSameLevel(i: number, n: number): boolean {
    return Math.floor(i / this.width) == Math.floor(n / this.width);
  }

  neighbours(i: number): number[] {
    const neighbours = [];

    const t = i - this.width;
    const b = i + this.width;
    const l = i - 1;
    const r = i + 1;

    if (this.exists(t)) {
      neighbours.push(t);
    }
    if (this.exists(b)) {
      neighbours.push(b);
    }
    if (this.exists(l) && this.isOnSameLevel(i, l)) {
      neighbours.push(l);
    }
    if (this.exists(r) && this.isOnSameLevel(i, r)) {
      neighbours.push(r);
    }

    return neighbours;
  }

  isLowestBetweenNeighbours(i: number) {
    for (const neighbour of this.neighbours(i)) {
      if (this.isHigherOrSameThan(i, neighbour)) {
        return false;
      }
    }

    return true;
  }

  isHigherOrSameThan(index: number, compared: number): boolean {
    return this.heights[index] >= this.heights[compared];
  }

  isEdgeOfBasin(index: number): boolean {
    return this.heights[index] == 9;
  }
}

const parseInput = (rawInput: string): Heightmap => {
  const lines = rawInput.split("\n");
  const width = lines[0].length;
  const height = lines.length;

  const heights = lines.flatMap((line) => {
    return line.split("").map((item) => +item);
  });

  return new Heightmap(heights, width, height);
};

const part1 = (rawInput: string) => {
  const heightmap = parseInput(rawInput);
  let riskLevel = 0;
  const heights = heightmap.heights;

  for (const [index, entry] of heights.entries()) {
    if (heightmap.isLowestBetweenNeighbours(index)) {
      riskLevel += 1 + entry;
    }
  }

  return riskLevel;
};

class Basin {
  size = 0;
  indexes: Set<number> = new Set();

  add(index: number) {
    if (!this.indexes.has(index)) {
      this.size += 1;
      this.indexes.add(index);
    }
  }
}

function exploreBasin(
  heightmap: Heightmap,
  exploring: number[],
  basin: Basin,
): Basin {
  if (exploring.length == 0) {
    return basin;
  }

  const toExplore: Set<number> = new Set();

  for (const index of exploring) {
    const neighbours = heightmap.neighbours(index);

    for (const neighbour of neighbours) {
      if (
        !heightmap.isEdgeOfBasin(neighbour) &&
        !basin.indexes.has(neighbour)
      ) {
        basin.add(neighbour);
        toExplore.add(neighbour);
      }
    }
  }

  return exploreBasin(heightmap, [...toExplore], basin);
}

const part2 = (rawInput: string) => {
  const heightmap = parseInput(rawInput);
  const heights = heightmap.heights;

  const basins: Basin[] = [];
  const alreadyCheckedIndexes: Set<number> = new Set();

  for (const index of heights.keys()) {
    if (!heightmap.isEdgeOfBasin(index) && !alreadyCheckedIndexes.has(index)) {
      const basin = exploreBasin(heightmap, [index], new Basin());
      basin.indexes.forEach((index) => alreadyCheckedIndexes.add(index));
      basins.push(basin);
    }
  }

  return basins
    .sort((a: Basin, b: Basin) => b.size - a.size)
    .slice(0, 3)
    .map((b: Basin) => b.size)
    .reduce((p: number, c: number) => p * c, 1);
};

run({
  part1: {
    tests: [
      {
        input: `
        2199943210
        3987894921
        9856789892
        8767896789
        9899965678`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        2199943210
        3987894921
        9856789892
        8767896789
        9899965678`,
        expected: 1134,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
