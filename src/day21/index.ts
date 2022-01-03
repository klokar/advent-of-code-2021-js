import run from "aocrunner";

const parseInput = (rawInput: string): number[] => {
  const lines = rawInput.split("\n");
  return [+lines[0].split(": ")[1], +lines[1].split(": ")[1]];
};

class Dice {
  score = 0;
  maxRoll = 100;
  rollCount = 0;

  roll(n = 3): number {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      this.score += 1;
      this.rollCount += 1;

      sum += this.score % this.maxRoll;
    }

    if (this.score > this.maxRoll) {
      this.score = this.score % this.maxRoll;
    }

    return sum;
  }
}

class Player {
  space: number;
  score = 0;
  maxSpace = 10;
  endScore: number;

  constructor(space: number, score: number, endScore = 1000) {
    this.space = space;
    this.score = score;
    this.endScore = endScore;
  }

  move(positions: number) {
    this.space = this.space + positions;
    if (this.space > this.maxSpace) {
      const newSpace = this.space % this.maxSpace;
      this.space = newSpace == 0 ? this.maxSpace : newSpace;
    }

    this.score += this.space;
  }

  hasWon(): boolean {
    return this.score >= this.endScore;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const player1: Player = new Player(input[0], 0);
  const player2: Player = new Player(input[1], 0);
  const dice: Dice = new Dice();

  while (!player1.hasWon() && !player2.hasWon()) {
    player1.move(dice.roll());
    if (player1.hasWon()) {
      break;
    }

    player2.move(dice.roll());
  }

  return (player1.hasWon() ? player2.score : player1.score) * dice.rollCount;
};

class Game {
  player1: Player;
  player2: Player;
  occurrences: number;

  isPlayer1Move: boolean;

  constructor(p1: Player, p2: Player, occurrences: number, p1Move: boolean) {
    this.player1 = p1;
    this.player2 = p2;
    this.occurrences = occurrences;
    this.isPlayer1Move = p1Move;
  }

  move(positions: number) {
    if (this.isPlayer1Move) {
      this.player1.move(positions);
    } else {
      this.player2.move(positions);
    }
  }

  copy(newOccurrence: number): Game {
    const p1Copy = new Player(
      this.player1.space,
      this.player1.score,
      this.player1.endScore,
    );
    const p2Copy = new Player(
      this.player2.space,
      this.player2.score,
      this.player2.endScore,
    );
    return new Game(p1Copy, p2Copy, newOccurrence, this.isPlayer1Move);
  }

  hasWinner() {
    return this.player1.hasWon() || this.player2.hasWon();
  }

  changePlayerTurns() {
    this.isPlayer1Move = !this.isPlayer1Move;
  }

  cacheKey(): string {
    return `${this.player1.space},${this.player1.score},${this.player2.space},${this.player2.score}`;
  }
}

function outcomesOfSingleTurn(): Map<number, number> {
  const throws = 3;
  const minValue = 1;
  const maxValue = 3;
  const rolls: Map<number, number> = new Map(
    [...Array(throws * throws - minValue * throws)].map((_, i) => [
      i + throws,
      0,
    ]),
  );

  for (let i = minValue; i <= maxValue; i++) {
    for (let j = minValue; j <= maxValue; j++) {
      for (let k = minValue; k <= maxValue; k++) {
        const key = i + j + k;
        const currentVal = rolls.get(key);
        rolls.set(key, currentVal ? currentVal + 1 : 1);
      }
    }
  }

  return rolls;
}

function throwDice(games: Game[], wins: number[]): { g: Game[]; w: number[] } {
  if (games.length == 0) {
    return {
      g: games,
      w: wins,
    };
  }

  const continuedGames: Map<string, Game> = new Map<string, Game>();

  for (const game of games) {
    for (const [value, occurrences] of outcomesOfSingleTurn()) {
      const updatedOccurrence = game.occurrences * occurrences;
      const gameSplit = game.copy(updatedOccurrence);

      gameSplit.move(value);

      if (gameSplit.hasWinner()) {
        gameSplit.isPlayer1Move
          ? (wins[0] += updatedOccurrence)
          : (wins[1] += updatedOccurrence);
      } else {
        gameSplit.changePlayerTurns();

        const cacheKey = gameSplit.cacheKey();
        const existingGame = continuedGames.get(cacheKey);
        if (existingGame) {
          existingGame.occurrences += updatedOccurrence;
          continuedGames.set(cacheKey, existingGame);
        } else {
          continuedGames.set(cacheKey, gameSplit);
        }
      }
    }
  }

  return throwDice([...continuedGames.values()], wins);
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const winningScore = 21;
  const p1: number = input[0];
  const p2: number = input[1];
  const games = [
    new Game(
      new Player(p1, 0, winningScore),
      new Player(p2, 0, winningScore),
      1,
      true,
    ),
  ];
  const scores = [0, 0];

  throwDice(games, scores);

  return Math.max(...scores);
};

run({
  part1: {
    tests: [
      {
        input: `
        Player 1 starting position: 4
        Player 2 starting position: 8`,
        expected: 739785,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Player 1 starting position: 4
        Player 2 starting position: 8`,
        expected: 444356092776315,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
