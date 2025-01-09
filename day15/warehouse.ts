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

    while (this.instructions.length > 0) {
      this.attemptMove();
    }
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

  getPosition() {
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[0].length; c++) {
        if (this.grid[r][c] === "@") {
          return [r, c];
        }
      }
    }
  }

  findEmptySpace(direction: number[]): number {
    const [r, c] = this.getPosition();

    const getChar = (range: number): string =>
      this.grid[r + direction[0] * range][c + direction[1] * range];

    let range = 1;

    while (true) {
      const char = getChar(range);

      switch (char) {
        case ".":
          return range;
        case "#":
          return 0;
        default:
          range++;
      }
    }
  }

  updateGrid(direction: number[], nextEmptySpace: number) {
    const [r, c] = this.getPosition();

    // Update current position
    this.grid[r][c] = ".";

    // Update the movement marker
    this.grid[r + direction[0]][c + direction[1]] = "@";

    // Replace the box if needed
    if (nextEmptySpace > 1) {
      this.grid[r + direction[0] * nextEmptySpace][
        c + direction[1] * nextEmptySpace
      ] = "O";
    }
  }

  attemptMove() {
    const instruction = this.instructions.shift();
    const direction = directions[instruction];

    const nextEmptySpace = this.findEmptySpace(direction);

    if (nextEmptySpace > 0) {
      this.updateGrid(direction, nextEmptySpace);
    }
  }
}
