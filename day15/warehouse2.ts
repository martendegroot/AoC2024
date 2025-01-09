import fs from "node:fs";

const directions = {
  ">": [0, 1],
  "<": [0, -1],
  "^": [-1, 0],
  v: [1, 0],
};

export class WareHouse {
  grid = [];
  instructions = null;

  constructor(filename: string) {
    this.importFile(filename);
  }

  importFile(filename: string) {
    const positionsInput = fs.readFileSync(filename + ".positions.txt", "utf8");
    const rows = positionsInput.split("\n");
    this.grid = rows.map((row) => Array.from(row));

    const instructionsInput = fs
      .readFileSync(filename + ".instructions.txt", "utf8")
      .replaceAll("\n", "");
    this.instructions = Array.from(instructionsInput);
  }

  widenGrid() {
    const newGrid = this.grid.map((row) =>
      row.flatMap((c: string) => {
        if (c === "#") return ["#", "#"];
        if (c === "O") return ["[", "]"];
        if (c === ".") return [".", "."];
        if (c === "@") return ["@", "."];
      })
    );

    this.grid = newGrid;
  }

  solve() {
    while (this.instructions.length > 0) {
      this.attemptMove();
    }
  }

  getPosition() {
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[0].length; c++) {
        if (this.grid[r][c] === "@") {
          return [r, c];
        }
      }
    }
  }

  moveFreely(direction: number[]) {
    const [r, c] = this.getPosition();

    // Update current position
    this.grid[r][c] = ".";

    // Update the movement marker
    this.grid[r + direction[0]][c + direction[1]] = "@";
  }

  findHorizontalSpace(position: number[], direction: number[]): number {
    const [r, c] = position;

    const getChar = (range: number): string =>
      this.grid[r + direction[0] * range][c + direction[1] * range];

    let i = 1;
    while (true) {
      const char = getChar(i);

      if (char === ".") return r;
      if (char === "#") return 0;

      i++;
    }
  }

  horizontalPush(direction: number[]) {
    const position = this.getPosition();
    const space = this.findHorizontalSpace(position, direction);

    const [r, c] = position;

    // Remove free space
    this.grid[r].splice(space, 1);

    // Add in free space behind
    this.grid[r].splice(c - direction[1], 0, ".");
  }

  pushBox(direction: number[]) {
    if (direction[0] === 0) {
      this.horizontalPush(direction);
    } else {
    }
  }

  attemptMove() {
    const instruction = this.instructions.shift();
    const direction = directions[instruction];

    const [r, c] = direction;
    const nextChar = this.grid[r + direction[0]][c + direction[1]];

    if (nextChar === ".") {
      this.moveFreely(direction);
    } else if (nextChar === "[" || nextChar === "]") {
      this.pushBox(direction);
    }
  }

  calculateScore() {
    let sum = 0;

    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[0].length; c++) {
        if (this.grid[r][c] === "[") {
          sum += 100 * r + c;
        }
      }
    }

    return sum;
  }
}
