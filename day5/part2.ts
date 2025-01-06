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

const checkLine = (line: number[], returnInvalid) => {
  const lineCopy = [...line];

  while (lineCopy.length > 1) {
    const subject: number = lineCopy.pop() ?? 0;

    if (rulesMap[subject]) {
      for (const descendant of rulesMap[subject]) {
        if (lineCopy.includes(descendant)) {
          return returnInvalid ? line : false;
        }
      }
    }
  }

  return returnInvalid ? false : line;
};

const inValidLines = input
  .map((line: number[]) => checkLine(line, true))
  .filter((line: number[] | boolean) => Array.isArray(line));


for (const line of inValidLines) {
  line.sort((a: number, b: number) => {
    if (!rulesMap[a]) return 1;
    if (!rulesMap[b]) return -1;

    if (rulesMap[a].includes(b)) {
      return -1;
    }
    if (rulesMap[b].includes(a)) {
      return 1;
    }
    return 0;
  });
}

let sum = 0;

for (const line of inValidLines) {
  sum += line[(line.length - 1) / 2];
}

console.log(sum);
