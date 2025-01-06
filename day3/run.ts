import fs from "node:fs";

const parseMul = (mul: string): number => {
  const numbers = [...mul.matchAll(/\d+/g)].map((result) => Number(result[0]));

  return numbers[0] * numbers[1];
};

const closestIndex = (needle: number, stack: number[]) => {
  let index = 0;
  let hightestIndex = -1;

  while (index < stack.length && stack[index] < needle) {
    hightestIndex = stack[index];
    index++;
  }

  return hightestIndex;
};

const data = fs.readFileSync("input.txt", "utf8");

const muls = [...data.matchAll(/mul\([\d]+,[\d]+\)/g)].map((result) => ({
  num: parseMul(result[0]),
  index: result.index,
}));
const dos = [...data.matchAll(/do\(\)/g)].map(({ index }) => index);
const donts = [...data.matchAll(/don\'t\(\)/g)].map(({ index }) => index);

let sum = 0;

const firstDontIndex = donts[0];

for (const mul of muls) {
  if (mul.index < firstDontIndex) sum += mul.num;

  const closestDo = closestIndex(mul.index, dos);
  const closestDont = closestIndex(mul.index, donts);

  if (closestDo > closestDont) sum += mul.num;
}

console.log(sum);

// total: 157621318
