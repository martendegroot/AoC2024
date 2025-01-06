import fs from "node:fs";
const input = JSON.parse(fs.readFileSync("input.json", "utf8"));

/**
 * Types
 */

type Direction =
  | "TopLeft"
  | "Top"
  | "TopRight"
  | "Left"
  | "Right"
  | "BottomLeft"
  | "Bottom"
  | "BottomRight";

const directions: Direction[] = [
  "TopLeft",
  "Top",
  "TopRight",
  "Left",
  "Right",
  "BottomLeft",
  "Bottom",
  "BottomRight",
];

/**
 * Helpers
 */

const isOutOfBounds = (r: number, c: number): boolean => {
  return r < 0 || r >= input.length || c < 0 || c >= input[r].length;
};

const recurse = (
  r: number,
  c: number,
  direction: Direction,
  remainder: string = "XMAS"
): boolean => {
  if (remainder.length === 0) {
    return true;
  }

  if (isOutOfBounds(r, c)) return false;

  if (input[r][c] !== remainder[0]) return false;

  const newRemainder = remainder.substring(1);

  switch (direction) {
    case "TopLeft":
      return recurse(r - 1, c - 1, direction, newRemainder);
    case "Top":
      return recurse(r - 1, c, direction, newRemainder);
    case "TopRight":
      return recurse(r - 1, c + 1, direction, newRemainder);
    case "Left":
      return recurse(r, c - 1, direction, newRemainder);
    case "Right":
      return recurse(r, c + 1, direction, newRemainder);
    case "BottomLeft":
      return recurse(r + 1, c - 1, direction, newRemainder);
    case "Bottom":
      return recurse(r + 1, c, direction, newRemainder);
    case "BottomRight":
      return recurse(r + 1, c + 1, direction, newRemainder);
    default:
      throw new Error(
        `this went wrong with Row ${r} on char ${c} in direction ${direction} and remainder ${remainder}`
      );
  }
};

const isXmas = (
  r: number,
  c: number
): { outcome: number; r: number; c: number } => {
  return {
    outcome: directions
      .map((direction) => recurse(r, c, direction))
      .filter((outcome) => !!outcome).length,
    r,
    c,
  };
};

/**
 * Run
 */

let sum = 0;

for (let r = 0; r < input.length; r++) {
  for (let c = 0; c < input[r].length; c++) {
    if (input[r][c] === "X") {
      const result = isXmas(r, c);
      if (result.outcome > 0) {
        console.log("found at ", result.r, result.c);
        sum += result.outcome;
      }
    }
  }
}

console.log("sum:", sum);
