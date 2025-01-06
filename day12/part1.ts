import fs from "node:fs";

const input = fs.readFileSync("input.txt", "utf8");
const rows = input.split("\n");
const matrix = rows.map((row) => Array.from(row));

const visited = {};
for (let r = 0; r < matrix.length; r++) {
  visited[r] = {};
}

/**
 * Area exploration
 */
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

interface Area {
  [x: string]: {
    surface: number;
    perimeter: number;
  };
}

const areaCost = (sPos: number[]): Area => {
  const [startY, startX] = sPos;
  const areaCode = matrix[startY][startX];

  let surface = 0;
  let perimeter = 0;

  const explore = (position: number[]) => {
    const [y, x] = position;

    visited[y][x] = true;
    surface += 1;
    perimeter += 4;

    // explore other direections
    directions.map((direction) => {
      const newX = x + direction[1],
        newY = y + direction[0];

      if (
        newY < 0 ||
        newY >= matrix.length ||
        newX < 0 ||
        newX >= matrix[0].length
      ) {
        return;
      }

      if (visited[newY][newX]) {
        if (matrix[newY][newX] === areaCode) {
          perimeter -= 1;
        }
        return;
      }

      const newPositionCode = matrix[newY][newX];
      if (newPositionCode !== areaCode) {
        return;
      }

      perimeter -= 1;
      explore([newY, newX]);
    });
  };

  explore([startY, startX]);

  return { [areaCode]: { surface, perimeter } };
};

/**
 * Surface walking
 */
const areas: Area[] = [];

for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[r].length; c++) {
    if (!visited[r][c]) {
      areas.push(areaCost([r, c]));
    }
  }
}

let cost = 0;

for (const area of areas) {
  const code = Object.keys(area)[0];
  cost += area[code].surface * area[code].perimeter;
}

console.log(cost);
