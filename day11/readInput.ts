import fs from "node:fs";

const input =
  //   "2097446912 14168 4048 2 0 2 4 40 48 2024 40 48 80 96 2 8 6 7 6 0 3 2"
  "1036288 7 2 20 24 4048 1 4048 8096 28 67 60 32"
    .split(" ")
    .map((string) => Number(string));
// const input = fs
//   .readFileSync("input.test.txt", "utf8")
//   .split(" ")
//   .map((string) => Number(string));

const numbers = {};

// load all numbers
for (const num of input) {
  const cleanNum = Number(num).toString();
  if (!numbers[cleanNum]) {
    numbers[cleanNum] = 1;
  } else {
    numbers[cleanNum]++;
  }
}

console.log(numbers);
console.log("length:", Object.keys(numbers).length);
