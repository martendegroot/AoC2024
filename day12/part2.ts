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
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const borders = {};

interface Area {
  areaCode: string;
  surface: number;
  edges: number;
  perimeter: number;
}

enum BorderSide {
  RIGHT,
  DOWN,
  LEFT,
  UP,
}

interface Border {
  x: number;
  y: number;
  side: BorderSide;
}

const areaCost = (startingPosition: number[]): Area => {
  const [startY, startX] = startingPosition;
  const areaCode = matrix[startY][startX];

  let surface = 0;
  let perimeter = 0;
  let edges = 0;
  borders[areaCode] = [] as Border[];

  const explore = (position: number[]) => {
    const [y, x] = position;

    visited[y][x] = true;
    surface += 1;
    perimeter += 4;

    // explore other direections
    directions.map((direction, index) => {
      const newX = x + direction[1],
        newY = y + direction[0];

      if (
        newY < 0 ||
        newY >= matrix.length ||
        newX < 0 ||
        newX >= matrix[0].length
      ) {
        borders[areaCode].push({ x, y, side: BorderSide[index] });
        return;
      }

      if (visited[newY][newX]) {
        if (matrix[newY][newX] === areaCode) {
          perimeter -= 1;
        } else {
          borders[areaCode].push({ x, y, side: BorderSide[index] });
        }
        return;
      }

      const newPositionCode = matrix[newY][newX];
      if (newPositionCode !== areaCode) {
        borders[areaCode].push({ x, y, side: BorderSide[index] });
        return;
      }

      perimeter -= 1;
      explore([newY, newX]);
    });
  };

  explore(startingPosition);

  for (let s = 0; s < 4; s++) {
    const bs: Border[] = borders[areaCode].filter(
      ({ side }) => side === BorderSide[s]
    );
    if (s === 0 || s === 2) {
      const allX = bs
        .filter(
          (b1, index, self) => self.findIndex((b2) => b1.x === b2.x) === index
        )
        .map((b) => b.x)
        .sort();

      const allXBorders = allX.map((ux) =>
        bs.filter(({ x }) => ux === x).sort((a, b) => a.y - b.y)
      );

      for (const bordersOnX of allXBorders) {
        let nextY = -1;
        for (const border of bordersOnX) {
          if (border.y !== nextY) {
            edges++;
            nextY = border.y + 1;
          } else {
            nextY++;
          }
        }
      }
    } else {
      const allY: number[] = bs
        .filter(
          (b1, index, self) => self.findIndex((b2) => b1.y === b2.y) === index
        )
        .map((b) => b.y)
        .sort();

      const allYBorders = allY.map((uy) =>
        bs.filter(({ y }) => uy === y).sort((a, b) => a.x - b.x)
      );

      for (const bordersOnY of allYBorders) {
        let nextX = -1;
        for (const border of bordersOnY) {
          if (border.x !== nextX) {
            edges++;
            nextX = border.x + 1;
          } else {
            nextX++;
          }
        }
      }
    }
  }

  return { areaCode, surface, edges, perimeter };
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
  cost += area.surface * area.edges;
}

console.log(cost);
