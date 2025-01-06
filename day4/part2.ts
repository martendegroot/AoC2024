import fs from "node:fs";
const input = JSON.parse(fs.readFileSync("input.json", "utf8"));

/**
 * Helpers
 */

const isOutOfBounds = (r: number, c: number): boolean => {
  return r < 0 || r >= input.length || c < 0 || c >= input[r].length;
};

const isXmas = (
  r: number,
  c: number
): { outcome: boolean; r: number; c: number } => {
  if (
    isOutOfBounds(r - 1, c - 1) ||
    isOutOfBounds(r - 1, c + 1) ||
    isOutOfBounds(r + 1, c - 1) ||
    isOutOfBounds(r + 1, c + 1)
  ) {
    return { outcome: false, r, c };
  }

  if (input[r - 1][c - 1] === "M" && input[r + 1][c + 1] === "S") {
    if (input[r - 1][c + 1] === "M" && input[r + 1][c - 1] === "S") {
      return { outcome: true, r, c };
    }
    if (input[r - 1][c + 1] === "S" && input[r + 1][c - 1] === "M") {
      return { outcome: true, r, c };
    }
  } else if (input[r - 1][c - 1] === "S" && input[r + 1][c + 1] === "M") {
    if (input[r - 1][c + 1] === "M" && input[r + 1][c - 1] === "S") {
      return { outcome: true, r, c };
    }
    if (input[r - 1][c + 1] === "S" && input[r + 1][c - 1] === "M") {
      return { outcome: true, r, c };
    }
  }

  return { outcome: false, r, c };
};

/**
 * Run
 */

let sum = 0;

for (let r = 0; r < input.length; r++) {
  for (let c = 0; c < input[r].length; c++) {
    if (input[r][c] === "A") {
      const result = isXmas(r, c);
      if (result.outcome) {
        console.log("found at ", result.r, result.c);
        sum += 1;
      }
    }
  }
}

console.log("sum:", sum);
