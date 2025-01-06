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

interface Area {
  areaCode: string;
  surface: number;
  edges: number;
  perimeter: number;
}

const areaCost = (startingPosition: number[]): Area => {
  const [startY, startX] = startingPosition;
  const areaCode = matrix[startY][startX];

  let surface = 0;
  let perimeter = 0;
  let edges = 1;

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

  explore(startingPosition);

  let moves = 0;

  const walkBorder = (position: number[], directionIndex: number) => {
    moves++;
    const [y, x] = position;

    if (
      position[0] === startingPosition[0] &&
      position[1] === startingPosition[1] &&
      moves > 1
    ) {
      const probeIndex = directionIndex - 1 < 0 ? 3 : directionIndex - 1;
      const probeDirection = directions[probeIndex];
      const probeX = x + probeDirection[1],
        probeY = y + probeDirection[0];

      if (
        !(
          probeY >= 0 &&
          probeY < matrix.length &&
          probeX >= 0 &&
          probeX < matrix[0].length &&
          matrix[probeY][probeX] === areaCode
        )
      ) {
        const rightDirectionIndex =
          directionIndex + 1 < 4 ? directionIndex + 1 : 0;
        const rightDirection = directions[rightDirectionIndex];
        const rightX = x + rightDirection[1],
          rightY = y + rightDirection[0];
        if (
          rightY >= 0 &&
          rightY < matrix.length &&
          rightX >= 0 &&
          rightX < matrix[0].length &&
          matrix[rightY][rightX] === areaCode
        ) {
          return;
        } else {
          if ((edges + 1) % 2 === 0) {
            edges++;
          }
          return;
        }
      }
    }

    // Turn left
    const probeIndex = directionIndex - 1 < 0 ? 3 : directionIndex - 1;
    const probeDirection = directions[probeIndex];
    const probeX = x + probeDirection[1],
      probeY = y + probeDirection[0];

    if (
      probeY >= 0 &&
      probeY < matrix.length &&
      probeX >= 0 &&
      probeX < matrix[0].length &&
      matrix[probeY][probeX] === areaCode
    ) {
      edges++;

      console.log(areaCode, moves, "turning left on", position, {
        probeX,
        probeY,
      });
      return walkBorder([probeY, probeX], probeIndex);
    }

    // Continue
    const continuedDirection = directions[directionIndex];
    const conX = x + continuedDirection[1],
      conY = y + continuedDirection[0];

    if (
      conY >= 0 &&
      conY < matrix.length &&
      conX >= 0 &&
      conX < matrix[0].length &&
      matrix[conY][conX] === areaCode
    ) {
      console.log(areaCode, moves, "straight on", position);
      return walkBorder([conY, conX], directionIndex);
    }

    // Turn right
    const breakDirectionIndex = directionIndex + 1 < 4 ? directionIndex + 1 : 0;
    const breakDirection = directions[breakDirectionIndex];
    const breakX = x + breakDirection[1],
      breakY = y + breakDirection[0];

    if (
      breakY >= 0 &&
      breakY < matrix.length &&
      breakX >= 0 &&
      breakX < matrix[0].length &&
      matrix[breakY][breakX] === areaCode
    ) {
      edges++;

      console.log(areaCode, moves, "turn right on", position);
      return walkBorder([breakY, breakX], breakDirectionIndex);
    }

    // Turn back
    const returnDirectionIndex =
      directionIndex + 2 < 4 ? directionIndex + 2 : directionIndex - 2;
    const returnDirection = directions[returnDirectionIndex];
    const returnX = x + returnDirection[1],
      returnY = y + returnDirection[0];

    if (
      returnY >= 0 &&
      returnY < matrix.length &&
      returnX >= 0 &&
      returnX < matrix[0].length &&
      matrix[returnY][returnX] === areaCode
    ) {
      edges += 2;

      console.log(areaCode, moves, "turn back on", position);
      return walkBorder([returnY, returnX], returnDirectionIndex);
    }

    console.log({
      startingPosition,
      areaCode,
      position,
      directionIndex,
      edges,
    });
    throw Error("something isn't right");
  };

  if (surface !== 1) {
    walkBorder(startingPosition, 0);
  } else {
    edges = 4;
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

console.log(areas);

let cost = 0;

for (const area of areas) {
  cost += area.surface * area.edges;
}

console.log(cost);
