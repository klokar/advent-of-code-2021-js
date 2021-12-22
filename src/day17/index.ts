import run from "aocrunner";

const parseInput = (rawInput: string): [number, number, number, number] => {
  const [x, y] = rawInput.slice(13).split(", ");
  const [xFrom, xTo] = x.slice(2).split("..");
  const [yFrom, yTo] = y.slice(2).split("..");

  return [+xFrom, +xTo, +yFrom, +yTo];
};

const part1 = (rawInput: string) => {
  const target = parseInput(rawInput);

  let maxY = 0;
  const probe = new ProbeLaunch(...target);
  for (let xV = 1; xV < 200; xV++) {
    for (let yV = 1; yV < 200; yV++) {
      if (probe.test(xV, yV) && probe.maxY > maxY) {
        maxY = probe.maxY;
      }
    }
  }

  return maxY;
};

const part2 = (rawInput: string) => {
  const target = parseInput(rawInput);

  let velocities = 0;
  const probe = new ProbeLaunch(...target);
  for (let xV = 1; xV < 300; xV++) {
    for (let yV = -300; yV < 300; yV++) {
      if (probe.test(xV, yV)) {
        velocities++;
      }
    }
  }

  return velocities;
};

class ProbeLaunch {
  x = 0;
  y = 0;

  targetXFrom: number;
  targetXTo: number;
  targetYFrom: number;
  targetYTo: number;

  velocityX = 0;
  velocityY = 0;
  maxY = 0;

  constructor(
    targetXFrom: number,
    targetXTo: number,
    targetYFrom: number,
    targetYTo: number,
  ) {
    this.targetXFrom = targetXFrom;
    this.targetXTo = targetXTo;
    this.targetYFrom = targetYFrom;
    this.targetYTo = targetYTo;
    console.log(
      "Coordinates received",
      this.targetXFrom,
      this.targetXTo,
      this.targetYFrom,
      this.targetYTo,
    );
  }

  public test(velocityX: number, velocityY: number): boolean {
    this.x = 0;
    this.y = 0;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.maxY = 0;

    // While not over target zone
    while (this.y > this.targetYFrom && !this.zoneReached()) {
      this.move();
    }

    return this.zoneReached();
  }

  private move() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Set max height
    if (this.y > this.maxY) {
      this.maxY = this.y;
    }

    // Calculate new velocities
    if (this.velocityX != 0) {
      this.velocityX > 0 ? (this.velocityX -= 1) : (this.velocityX += 1);
    }
    this.velocityY -= 1;
  }

  private zoneReached(): boolean {
    return (
      this.x >= this.targetXFrom &&
      this.x <= this.targetXTo &&
      this.y >= this.targetYFrom &&
      this.y <= this.targetYTo
    );
  }
}

run({
  part1: {
    tests: [
      {
        input: `target area: x=20..30, y=-10..-5`,
        expected: 45,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `target area: x=20..30, y=-10..-5`,
        expected: 112,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
