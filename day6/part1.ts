import fs from "node:fs";

const input = fs.readFileSync("input.test.txt", "utf8");
const rows = input.split("\n");
const matrix = rows.map((row) => Array.from(row));

const startY = 6;
const startX = 4;
const startDY = -1;
const startDX = 0;

// const startY = 49;
// const startX = 39;
// const startDY = -1;
// const startDX = 0;

const visited = { [startY]: [startX] };

const move = (y: number, x: number, dy: number, dx: number) => {
  // Mark new place as visited
  if (!visited[y]) visited[y] = [];
  if (!visited[y].includes(x)) visited[y].push(x);

  // Check for end of the map
  if (
    y + dy < 0 ||
    y + dy === matrix.length ||
    x + dx < 0 ||
    x + dx === matrix[0].length
  ) {
    return true;
  }

  // For now, assume going as we did
  let newDY = dy;
  let newDX = dx;

  // But turn right on an obstacle
  if (matrix[y + dy][x + dx] === "#") {
    if (dy === 1 && dx === 0) {
      newDY = 0;
      newDX = -1;
    } else if (dy === -1 && dx === 0) {
      newDY = 0;
      newDX = 1;
    } else if (dy === 0 && dx === 1) {
      newDY = 1;
      newDX = 0;
    } else if (dy === 0 && dx === -1) {
      newDY = -1;
      newDX = 0;
    } else {
      throw new Error("invalid direction");
    }
  }

  const newY = y + newDY;
  const newX = x + newDX;

  return { newY, newX, newDY, newDX };
};

let solved = false;

let y = startY;
let x = startX;
let dY = startDY;
let dX = startDX;

while (!solved) {
  const result = move(y, x, dY, dX);

  if (typeof result === "boolean") break;

  y = result.newY;
  x = result.newX;
  dY = result.newDY;
  dX = result.newDX;
}

let sum = 0;

for (const y in visited) {
  sum += visited[y].length;
}

console.log(sum);
