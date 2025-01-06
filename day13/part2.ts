import { readInput } from "./readInput";
import { Move, Input } from "./types";

const ADDITION = 10000000000000;

const inputSeries = readInput("input.txt");

const adjustedSeries = inputSeries.map((input) => ({
  ...input,
  prize: { x: input.prize.x + ADDITION, y: input.prize.y + ADDITION },
}));

console.log("Got", adjustedSeries.length, "entries");

const start = Date.now();

const A_COST = 3;
const B_COST = 1;

const moves: Move[] = [];

const solveGame = (input: Input, index: number): number => {
  const tag = `${index + 1} / ${adjustedSeries.length} : `;

  const { a, b, prize } = input;

  const allX = [1, b.x / a.x, prize.x / a.x];
  const allY = [0, b.y - allX[1] * a.y, prize.y - allX[2] * a.y];

  const yEch = [0, 1, allY[2] / allY[1]];
  const xEch = [1, 0, allX[2] - yEch[2] * allX[1]];

  const A = xEch[2];
  const B = yEch[2];

  const AR = Math.round(A);
  const BR = Math.round(B);

  if (AR * a.x + BR * b.x === prize.x && AR * a.y + BR * b.y === prize.y) {
    return AR * A_COST + BR * B_COST;
  } else {
    return 0;
  }
};

const outcomes = adjustedSeries.map((input, i) => solveGame(input, i));

const end = Date.now();

let cost = 0;

for (const outcome of outcomes) {
  if (outcome < 0) {
    console.log(outcome);
    throw new Error("did not compute");
  }
  cost += outcome;
}

console.log("total:", cost);
console.log("in", Math.round((end - start) / 10) / 100, "s");
