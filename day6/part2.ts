import fs from "node:fs";

const input = fs.readFileSync("input.test2.txt", "utf8");
const rows = input.split("\n");
const matrix = rows.map((row) => Array.from(row));

const mh = matrix.length;
const mw = matrix[0].length;

/**
 * Init
 */

const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];
const incD = (d: number) => {
  return ++d > 3 ? 0 : d;
};

let start: {
  x: number;
  y: number;
  d: number;
} = { x: 0, y: 0, d: 0 };

for (let r = 0; r < mh; r++) {
  for (let c = 0; c < mw; c++) {
    if (matrix[r][c] === "^") {
      start.x = c;
      start.y = r;
    }
  }
}

let visited = {};

/**
 * Movement
 */

const move = (y: number, x: number, d: number) => {
  const [dy, dx] = directions[d];

  // Check for end of the map
  if (
    y + dy < 0 ||
    y + dy === matrix.length ||
    x + dx < 0 ||
    x + dx === matrix[0].length
  ) {
    return "end";
  }

  // Check if this place was visited before in same direction
  if (visited[y] && visited[y][x] && visited[y][x].includes(d)) {
    return "loop";
  }

  let newD = d;
  let [newDY, newDX] = directions[newD];

  let turns = 0;

  while (matrix[y + newDY][x + newDX] === "#") {
    turns++;
    newD = incD(newD);
    [newDY, newDX] = directions[newD];
  }

  const newY = y + newDY;
  const newX = x + newDX;

  // mark new place as visited
  if (!visited[y]) visited[y] = {};
  if (!visited[y][x]) visited[y][x] = [];
  if (!visited[y][x].includes(newD)) visited[y][x].push(newD);

  return { newY, newX, newD };
};

let y = start.y;
let x = start.x;
let d = start.d;

let obstacles = 0;

const notMovingOutOfBounds = (y: number, x: number, d: number): boolean => {
  switch (d) {
    case 0:
      return y > 0;
    case 1:
      return x < matrix[0].length - 1;
    case 2:
      return y < matrix.length - 1;
    case 3:
      return x > 0;
    default:
      return true;
  }
};

while (true) {
  const result = move(y, x, d);

  if (typeof result === "string") {
    break;
  }

  d = result.newD;

  if (notMovingOutOfBounds(y, x, d)) {
    /**
     * Replace matrix position with obstacle
     */
    const obstacle = [y + directions[d][0], x + directions[d][1]];
    matrix[obstacle[0]][obstacle[1]] = "#";

    /**
     * Probe
     */
    let probeD = incD(d);
    let [probeDY, probeDX] = directions[probeD];

    const visitedRestore = structuredClone(visited);

    while (matrix[y + probeDY][x + probeDX] === "#") {
      probeD = incD(probeD);
      [probeDY, probeDX] = directions[probeD];
    }
    let probeY = y + probeDY;
    let probeX = x + probeDX;

    let moves = 0;
    // check for loops
    while (true) {
      if (moves++ > 1000000) {
        console.log("loop");
        break;
      }
      const result = move(probeY, probeX, probeD);

      if (typeof result === "string") {
        if (result === "loop") {
          obstacles++;
        }
        break;
      }

      probeY = result.newY;
      probeX = result.newX;
      probeD = result.newD;
    }

    /**
     * Replace matrix obstacle with empty space
     */
    matrix[obstacle[0]][obstacle[1]] = ".";
    visited = visitedRestore;
  }

  y = result.newY;
  x = result.newX;
}

let sum = 1;

for (const y in visited) {
  sum += Object.keys(visited[y]).length;
}

console.log(obstacles);
console.log(sum);
