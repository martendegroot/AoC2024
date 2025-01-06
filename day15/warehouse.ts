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

  attemptMove() {
    const instruction = this.instructions.shift();
    const direction = directions[instruction];
  }
}
