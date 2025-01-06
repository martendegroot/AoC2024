import { readInput } from "./readInput";
import { Move, Input } from "./types";
import { isSolvableGame, shallowCompare } from "./utils";

const inputSeries = readInput("input.test.txt");

console.log("Got", inputSeries.length, "entries");

const start = Date.now();

const A_COST = 3;
const B_COST = 1;

const moves: Move[] = [];

const solveGame = (input: Input, index: number): number => {
  const tag = `${index + 1} / ${inputSeries.length} : `;

  if (!isSolvableGame(input)) {
    console.log(tag, "not solvable");
    return 0;
  }

  const { a, b, prize } = input;

  const possibleMoves: Move[] = [];

  possibleMoves.push({ cost: A_COST, x: a.x, y: a.y });
  possibleMoves.push({ cost: B_COST, x: b.x, y: b.y });
  possibleMoves.sort((a, b) => a.cost - b.cost);

  while (possibleMoves.length > 0) {
    const move = possibleMoves.shift() as Move;
    moves.push(move);

    if (move.x === prize.x && move.y === prize.y) {
      console.log(tag, move.cost);
      return move.cost;
    }

    const na = {
      cost: move.cost + A_COST,
      x: move.x + a.x,
      y: move.y + a.y,
    };
    if (
      na.x <= prize.x &&
      na.y <= prize.y &&
      !moves.some((move) => shallowCompare(move, na)) &&
      !possibleMoves.some((move) => shallowCompare(move, na))
    ) {
      possibleMoves.push(na);
    }

    const nb = {
      cost: move.cost + B_COST,
      x: move.x + b.x,
      y: move.y + b.y,
    };
    if (
      nb.x <= prize.x &&
      nb.y <= prize.y &&
      !moves.some((move) => shallowCompare(move, nb)) &&
      !possibleMoves.some((move) => shallowCompare(move, nb))
    ) {
      possibleMoves.push(nb);
    }

    possibleMoves.sort((a, b) => {
      if (a.cost === b.cost) return b.x + b.y - (a.x + a.y);
      else return a.cost - b.cost;
    });
  }

  console.log(tag, "not solveable (e)");
  return 0;
};

const outcomes = inputSeries.map((input, i) => solveGame(input, i));

const end = Date.now();

let cost = 0;

for (const outcome of outcomes) {
  if (outcome < 0) {
    throw new Error("did not compute");
  }
  cost += outcome;
}

console.log("total:", cost);
console.log("in", Math.round((end - start) / 10) / 100, "s");
