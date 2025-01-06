import fs from "node:fs";

const input = fs.readFileSync("input.txt", "utf8");
const rows = input.split("\n");

const sums: { sum: string; numbers: string[] }[] = [];

for (const row of rows) {
  const [sum, numbers] = row.split(":");
  sums.push({ sum: sum, numbers: numbers.trim().split(" ") });
}

const validSums: string[] = [];

const validateRow = (numbers: string[], sum: number, agg: number): boolean => {
  const [number, ...remainder] = numbers;

  if (remainder.length > 0) {
    return (
      validateRow(remainder, sum, Number(number) + agg) ||
      validateRow(remainder, sum, Number(number) * agg) ||
      validateRow(remainder, sum, Number(`${agg}${number}`))
    );
  }

  const result =
    Number(number) + agg === sum ||
    Number(number) * agg === sum ||
    Number(`${agg}${number}`) === sum;

  return result;
};

for (const { sum, numbers } of sums) {
  const [initialValue, ...remainder] = numbers;
  if (validateRow(remainder, Number(sum), Number(initialValue))) {
    validSums.push(sum);
  }
}

console.log(validSums.reduce((prev, curr) => prev + Number(curr), 0));
