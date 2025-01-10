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
      this.grid[r][c + direction[1] * range];

    let i = 1;
    while (true) {
      const char = getChar(i);

      if (char === ".") return i;
      if (char === "#") return 0;

      i++;
    }
  }

  horizontalPush(direction: number[], position: number[]) {
    const space = this.findHorizontalSpace(position, direction);

    if (space > 0) {
      const [r, c] = position;

      // Remove free space
      this.grid[r].splice(c + direction[1] * space, 1);

      // Add in free space behind
      this.grid[r].splice(c, 0, ".");
    }
  }

  getBoxPositions(direction: number[], position: number[]) {
    const [r, c] = position;

    const nextRow = r + direction[0];
    const nextCol = c + direction[1];
    const nextChar = this.grid[nextRow][nextCol];

    if (nextChar === "[") {
      return [
        [nextRow, nextCol],
        [nextRow, nextCol + 1],
      ];
    } else if (nextChar === "]") {
      return [
        [nextRow, nextCol],
        [nextRow, nextCol - 1],
      ];
    } else if (nextChar === "#") {
      return true;
    } else {
      return false;
    }
  }

  verticalPush(direction: number[], position: number[]) {
    const checkStack = this.getBoxPositions(direction, position) as number[][];
    const shiftStack = [...checkStack];

    while (checkStack.length > 0) {
      const boxPart = checkStack.shift();

      const outcome = this.getBoxPositions(direction, boxPart);

      if (typeof outcome === "boolean") {
        // If positive, the checkStack is blocked
        if (outcome) return;
      } else {
        for (const outcomePart of outcome) {
          if (
            !checkStack.some(
              (part) => part[0] === outcomePart[0] && part[1] === outcomePart[1]
            )
          ) {
            checkStack.push(...outcome);
            shiftStack.push(...outcome);
          }
        }
      }
    }

    // Update the grid
    while (shiftStack.length > 0) {
      const [br, bc] = shiftStack.pop();
      const partChar = this.grid[br][bc];

      this.grid[br + direction[0]][bc + direction[1]] = partChar;
      this.grid[br][bc] = ".";
    }

    // Update robot
    const [r, c] = position;
    this.grid[r + direction[0]][c + direction[1]] = "@";
    this.grid[r][c] = ".";
  }

  pushBox(direction: number[]) {
    const position = this.getPosition();

    if (direction[0] === 0) {
      this.horizontalPush(direction, position);
    } else {
      this.verticalPush(direction, position);
    }
  }

  attemptMove() {
    const position = this.getPosition();
    const instruction = this.instructions.shift();
    const direction = directions[instruction];

    const [r, c] = position;
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
