import fs from "node:fs";

// const SPACE_HEIGHT = 7;
// const SPACE_WIDTH = 11;
const SPACE_HEIGHT = 103;
const SPACE_WIDTH = 101;

type Robot = {
  x: number;
  y: number;
};

const createTiles = (): Robot[][][] =>
  Array(SPACE_HEIGHT)
    .fill(0)
    .map((_) =>
      Array(SPACE_WIDTH)
        .fill(0)
        .map((_) => [])
    );

export class Space {
  tiles = createTiles();

  constructor(filename: string) {
    this.importRobots(filename);
  }

  importRobots(filename: string) {
    const input = fs.readFileSync(filename, "utf8");
    const rows = input.split("\n");

    for (const row of rows) {
      const matches = row.match(/(-?\d+,-?\d+)/g);
      const position = matches[0].split(",");
      const velocity = matches[1].split(",");

      this.tiles[position[1]][position[0]].push({
        x: Number(velocity[0]),
        y: Number(velocity[1]),
      });
    }
  }

  tick() {
    const newTiles = createTiles();

    this.tiles.map((row, rowIndex) =>
      row.map((robots, colIndex) =>
        robots.map((robot) => {
          const newPosition = this.moveRobot(
            { row: rowIndex, col: colIndex },
            robot
          );
          newTiles[newPosition.row][newPosition.col].push(robot);
        })
      )
    );

    this.tiles = newTiles;
  }

  moveRobot({ row, col }: { row: number; col: number }, robot: Robot) {
    const { x, y } = robot;

    let newRow = row + y;
    let newCol = col + x;

    if (newRow < 0) {
      newRow += SPACE_HEIGHT;
    } else if (newRow >= SPACE_HEIGHT) {
      newRow -= SPACE_HEIGHT;
    }

    if (newCol < 0) {
      newCol += SPACE_WIDTH;
    } else if (newCol >= SPACE_WIDTH) {
      newCol -= SPACE_WIDTH;
    }

    return { row: newRow, col: newCol };
  }

  ticks(times: number) {
    for (let i = 0; i < times; i++) {
      this.tick();
    }
  }

  calculateSafetyFactor() {
    const upperHalf = this.tiles.slice(0, Math.floor(SPACE_HEIGHT / 2));
    const lowerHalf = this.tiles.slice(-Math.floor(SPACE_HEIGHT / 2));

    const q1 = upperHalf.map((row) =>
      row.slice(0, Math.floor(SPACE_WIDTH / 2))
    );
    const q2 = upperHalf.map((row) => row.slice(-Math.floor(SPACE_WIDTH / 2)));

    const q3 = lowerHalf.map((row) =>
      row.slice(0, Math.floor(SPACE_WIDTH / 2))
    );
    const q4 = lowerHalf.map((row) => row.slice(-Math.floor(SPACE_WIDTH / 2)));

    const qCounts = [q1, q2, q3, q4].map((q) => {
      let robotCount = 0;
      q.map((row) => row.map((robots) => (robotCount += robots.length)));
      return robotCount;
    });

    let safetyFactor = 1;

    for (const count of qCounts) {
      safetyFactor *= count;
    }

    return safetyFactor;
  }

  printTiles() {
    const picture = this.tiles
      .map((row) =>
        row.map((robots) => (robots.length > 0 ? robots.length : ".")).join("")
      )
      .join("\n");

    console.log(picture);
  }

  calculateSymmetryScore() {
    const center = Math.floor(SPACE_WIDTH / 2);

    const leftHalf = this.tiles.map((row) =>
      row.slice(0, center).map((robots) => robots.length)
    );
    const rightHalf = this.tiles.map((row) =>
      row.slice(-center).map((robots) => robots.length)
    );

    let scores = [];

    for (let r = 0; r < SPACE_HEIGHT; r++) {
      let nIdentical = 0;

      for (let c = 0; c < center; c++) {
        if (leftHalf[r][c] === rightHalf[r][center - 1 - c]) {
          nIdentical++;
        }
      }
      scores.push(nIdentical / center);
    }

    let scoreSum = 0;

    for (const score of scores) {
      scoreSum += score;
    }

    return scoreSum / SPACE_HEIGHT;
  }
}
