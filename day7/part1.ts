import fs from "node:fs";

const input = fs.readFileSync("input.txt", "utf8");
const rows = input.split("\n");

const sums: { sum: string; numbers: string[] }[] = [];

for (const row of rows) {
  const [sum, numbers] = row.split(":");
  sums.push({ sum: sum, numbers: numbers.trim().split(" ") });
}

const validSums: string[] = [];

const validateRow = (
  numbers: string[],
  sum: number,
  agg: number = 0
): boolean => {
  const [number, ...remainder] = numbers;

  if (remainder.length > 0) {
    return (
      validateRow(remainder, sum, Number(number) + agg) ||
      validateRow(remainder, sum, Number(number) * agg)
    );
  }

  return Number(number) + agg === sum || Number(number) * agg === sum;
};

for (const { sum, numbers } of sums) {
  if (validateRow(numbers, Number(sum))) {
    validSums.push(sum);
  }
}

console.log(validSums.reduce((prev, curr) => prev + Number(curr), 0));
