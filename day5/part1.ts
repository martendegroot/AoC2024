import fs from "node:fs";

const input = JSON.parse(fs.readFileSync("input.json", "utf8"));
const rules = JSON.parse(fs.readFileSync("rules.json", "utf8"));

const rulesMap = {};

for (const rule of rules) {
  const subject = rule[0];
  const target = rule[1];

  if (rulesMap[subject] === undefined) {
    rulesMap[subject] = [target];
  } else {
    rulesMap[subject] = [...rulesMap[subject], target];
  }
}

const checkLine = (line: number[]) => {
  const lineCopy = [...line];

  while (lineCopy.length > 1) {
    const subject: number = lineCopy.pop() ?? 0;

    if (rulesMap[subject]) {
      for (const descendant of rulesMap[subject]) {
        if (lineCopy.includes(descendant)) {
          return false;
        }
      }
    }
  }

  return line;
};

const validLines = input
  .map((line: number[]) => checkLine(line))
  .filter((line) => Array.isArray(line));

let sum = 0;

for (const line of validLines) {
  sum += line[(line.length - 1) / 2];
}

console.log(sum);
