import fs from "node:fs";

const input = Array.from(fs.readFileSync("input.txt", "utf8"));

/**
 * Compile the file
 */

const file: string[] = [];
let id = 0;

for (let c = 0; c < input.length; c++) {
  if (c % 2 === 0) {
    for (let b = 0; b < Number(input[c]); b++) {
      file.push(`${id}`);
    }
    id++;
  } else {
    for (let b = 0; b < Number(input[c]); b++) {
      file.push(".");
    }
  }
}

/**
 * Shift the file
 */

const nFree = [...file].sort().lastIndexOf(".") + 1;

for (let s = 0; s < nFree; s++) {
  const index = file.length - s - 1;
  const lastChar = file[index];
  file.splice(index, 1, ".");

  if (lastChar !== ".") {
    const firstFree = file.indexOf(".");
    file.splice(firstFree, 1, lastChar);
  }
}

/**
 * Calculate checksum
 */
let checksum = 0;

for (let i = 0; i < file.length; i++) {
  if (file[i] === ".") {
    break;
  }
  checksum += Number(file[i]) * i;
}

console.log(checksum);
