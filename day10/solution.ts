import fs from "node:fs";

const input = fs.readFileSync("input.txt", "utf8");
const rows = input.split("\n");
const matrix = rows.map((row) => Array.from(row));

const trailHeads: number[][] = [];
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

for (let r = 0; r < matrix.length; r++) {
  for (let c = 0; c < matrix[r].length; c++) {
    if (Number(matrix[r][c]) === 0) {
      trailHeads.push([r, c]);
    }
  }
}

let count = 0;
const destinations = {};

const calculateScore = (position: number[], height: number, head: string) => {
  if (height === 9) {
    count++;
    if (!destinations[head]) {
      destinations[head] = [];
    }

    const posString = JSON.stringify(position);
    if (!destinations[head].includes(posString)) {
      destinations[head].push(posString);
    }

    return;
  }

  directions.map((direction) => {
    const newPosition = [
      position[0] + direction[0],
      position[1] + direction[1],
    ];

    if (
      newPosition[0] < 0 ||
      newPosition[0] >= matrix.length ||
      newPosition[1] < 0 ||
      newPosition[1] >= matrix[0].length
    ) {
      return;
    }

    const newPosHeight = Number(matrix[newPosition[0]][newPosition[1]]);
    if (newPosHeight !== height + 1) {
      return;
    }

    calculateScore(newPosition, height + 1, head);
  });
};

trailHeads.map((head) => calculateScore(head, 0, JSON.stringify(head)));

let sum = 0;
for (const head in destinations) {
  sum += destinations[head].length;
}

console.log(count);
